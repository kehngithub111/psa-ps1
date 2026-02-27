import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { current } from "immer";
import { PathValue, PurchaseRequestPath } from "./paths";

// ============ TYPES ============

interface Schedule {
  dateStart: Date | number | undefined;
  dateEnd: Date | number | undefined;
  timeStart: string | number;
  timeEnd: string | number;
}

interface Activity {
  title: string;
  schedule: Schedule;
  venue: string;
  purpose: string;
}

interface NestedSpecification {
  title: string;
  specifications: string[];
}

interface Specifications {
  single: string[];
  nested: NestedSpecification[];
}

interface ItemDescription {
  title: string;
  descriptions: string[];
}

export interface NormalItem {
  id?: string;
  stockPropertyNo: string;
  unit: string;
  itemDescription: ItemDescription;
  quantity: number;
  unitCost: number;
  totalCost: number;
  specifications: Specifications;
}

export interface PurchaseRequest {
  prNumber: string;
  fundCluster: string;
  rcc: string;
  draftDate: Date | number | undefined;
  procurementMode: string;
  priorityLevel: string;
  chargedTo: string;
  papCode: string;
  officeSection: string;

  activity: Activity;

  normalItem: NormalItem[];

  delivery: {
    additionalInstruction: string;
    date: Date | undefined;
    time: string | number;
    location: string;
  };

  notes: string[];
  inclusions: string[];
  roomAccommodations: string[];
  functionRooms: string[];
  additionalRequirements: string[];

  requestedBy: string;
  approvedBy: string;
  inclusionedBy: string;
}

// ============ EMPTY/DEFAULT ITEMS ============

export const createEmptyNestedSpec = (): NestedSpecification => ({
  title: "Grouped Title",
  specifications: ["Spec 1", "Spec 2"],
});

export const createEmptySpecifications = (): Specifications => ({
  single: ["Single Spec 1", "Single Spec 2"],
  nested: [
    createEmptyNestedSpec(),
    createEmptyNestedSpec(),
    createEmptyNestedSpec(),
  ],
});

export const createEmptyItem = (): NormalItem => ({
  id: generateId(),
  stockPropertyNo: "",
  unit: "",
  itemDescription: {
    title: "",
    descriptions: [],
  },
  quantity: 0,
  unitCost: 0,
  totalCost: 0,
  specifications: createEmptySpecifications(),
});

// ============ STORE STATE ============
const generateId = () =>
  `item-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

interface StoreState {
  purchaseRequest: PurchaseRequest;

  // Dynamic field setter
  setField: <P extends PurchaseRequestPath>(
    path: P,
    value: PathValue<PurchaseRequest, P>,
  ) => void;

  // Normal Item Actions
  addItem: () => void;
  deleteItem: (index: number) => void;
  duplicateItem: (index: number) => void;
  moveItem: (fromIndex: number, toIndex: number) => void;

  // Specifications Actions (for a specific item)
  addSingleSpec: (itemIndex: number) => void;
  removeSingleSpec: (itemIndex: number, specIndex: number) => void;
  updateSingleSpec: (
    itemIndex: number,
    specIndex: number,
    value: string,
  ) => void;

  addNestedSpec: (itemIndex: number) => void;
  duplicateNestedSpec: (itemIndex: number, nestedIndex: number) => void;
  removeNestedSpec: (itemIndex: number, nestedIndex: number) => void;
  updateNestedSpecTitle: (
    itemIndex: number,
    nestedIndex: number,
    title: string,
  ) => void;
  addNestedSpecItem: (itemIndex: number, nestedIndex: number) => void;
  removeNestedSpecItem: (
    itemIndex: number,
    nestedIndex: number,
    specIndex: number,
  ) => void;
  updateNestedSpecItem: (
    itemIndex: number,
    nestedIndex: number,
    specIndex: number,
    value: string,
  ) => void;

  // Subtitle Actions
  addSubtitle: (itemIndex: number) => void;
  removeSubtitle: (itemIndex: number, subtitleIndex: number) => void;
  updateSubtitle: (
    itemIndex: number,
    subtitleIndex: number,
    value: string,
  ) => void;

  // Reset
  resetPurchaseRequest: () => void;

  reorderItems: (newItems: NormalItem[]) => void;
}

// ============ INITIAL STATE ============

const initialPurchaseRequest: PurchaseRequest = {
  prNumber: "",
  fundCluster: "FC",
  rcc: "RCC",
  draftDate: undefined,
  procurementMode: "small_value",
  priorityLevel: "urgent",
  chargedTo: "",
  papCode: "",
  officeSection: "socd",

  activity: {
    title: "This is a sample title for this procurement",
    schedule: {
      dateStart: undefined,
      dateEnd: undefined,
      timeStart: "08:00 AM",
      timeEnd: "05:00 PM",
    },
    venue: "Butuan City, Agusan del Norte",
    purpose: "This is a sample purpose for this procurement",
  },

  normalItem: [],

  delivery: {
    additionalInstruction: "10 days after the receipt of PO",
    date: undefined,
    time: "08:00 AM",
    location: "Butuan City, Agusan del Norte",
  },

  notes: [],
  inclusions: [],
  roomAccommodations: [],
  functionRooms: [],
  additionalRequirements: [],

  requestedBy: "",
  approvedBy: "",
  inclusionedBy: "",
};

// ============ HELPER FUNCTIONS ============

const setNestedValue = (obj: unknown, path: string, value: unknown): void => {
  const keys = path.split(".");
  let current = obj as Record<string, unknown>;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!isNaN(Number(key))) {
      current = (current as unknown as Array<unknown>)[Number(key)] as Record<
        string,
        unknown
      >;
    } else {
      current = current[key] as Record<string, unknown>;
    }
  }

  const lastKey = keys[keys.length - 1];
  if (!isNaN(Number(lastKey))) {
    (current as unknown as Array<unknown>)[Number(lastKey)] = value;
  } else {
    current[lastKey] = value;
  }
};

// ============ STORE ============

const useStore = create<StoreState>()(
  immer((set) => ({
    purchaseRequest: initialPurchaseRequest,

    // Dynamic setter for any path
    setField: (path, value) =>
      set((state) => {
        setNestedValue(state.purchaseRequest, path, value);
      }),

    // ============ NORMAL ITEM ACTIONS ============

    addItem: () =>
      set((state) => {
        state.purchaseRequest.normalItem.push(createEmptyItem());
      }),

    deleteItem: (index) =>
      set((state) => {
        state.purchaseRequest.normalItem.splice(index, 1);
      }),

    duplicateItem: (index: number) =>
      set((state) => {
        const items = state.purchaseRequest.normalItem;
        const originalItem = items[index];

        if (!originalItem) return;

        const plainItem = current(originalItem);
        const duplicatedItem: NormalItem = {
          ...JSON.parse(JSON.stringify(plainItem)),
          id: generateId(),
        };

        items.splice(index + 1, 0, duplicatedItem);
      }),

    moveItem: (fromIndex, toIndex) =>
      set((state) => {
        const items = state.purchaseRequest.normalItem;
        if (
          fromIndex >= 0 &&
          fromIndex < items.length &&
          toIndex >= 0 &&
          toIndex < items.length
        ) {
          const [item] = items.splice(fromIndex, 1);
          items.splice(toIndex, 0, item);
        }
      }),

    // ============ SINGLE SPECIFICATIONS ACTIONS ============

    addSingleSpec: (itemIndex) =>
      set((state) => {
        state.purchaseRequest.normalItem[itemIndex].specifications.single.push(
          "",
        );
      }),

    removeSingleSpec: (itemIndex, specIndex) =>
      set((state) => {
        state.purchaseRequest.normalItem[
          itemIndex
        ].specifications.single.splice(specIndex, 1);
      }),

    updateSingleSpec: (itemIndex, specIndex, value) =>
      set((state) => {
        state.purchaseRequest.normalItem[itemIndex].specifications.single[
          specIndex
        ] = value;
      }),

    // ============ NESTED SPECIFICATIONS ACTIONS ============

    addNestedSpec: (itemIndex) =>
      set((state) => {
        state.purchaseRequest.normalItem[itemIndex].specifications.nested.push(
          createEmptyNestedSpec(),
        );
      }),

    duplicateNestedSpec: (itemIndex: number, nestedIndex: number) =>
      set((state) => {
        const nestedSpecs =
          state.purchaseRequest.normalItem[itemIndex]?.specifications?.nested;

        if (!nestedSpecs || !nestedSpecs[nestedIndex]) return;

        // Get the original nested spec
        const originalNestedSpec = nestedSpecs[nestedIndex];

        // Deep clone it using current() + JSON parse/stringify
        const plainNestedSpec = current(originalNestedSpec);
        const duplicatedNestedSpec: NestedSpecification = JSON.parse(
          JSON.stringify(plainNestedSpec),
        );

        // Insert the duplicate after the original
        nestedSpecs.splice(nestedIndex + 1, 0, duplicatedNestedSpec);
      }),

    removeNestedSpec: (itemIndex, nestedIndex) =>
      set((state) => {
        state.purchaseRequest.normalItem[
          itemIndex
        ].specifications.nested.splice(nestedIndex, 1);
      }),

    updateNestedSpecTitle: (itemIndex, nestedIndex, title) =>
      set((state) => {
        state.purchaseRequest.normalItem[itemIndex].specifications.nested[
          nestedIndex
        ].title = title;
      }),

    addNestedSpecItem: (itemIndex, nestedIndex) =>
      set((state) => {
        state.purchaseRequest.normalItem[itemIndex].specifications.nested[
          nestedIndex
        ].specifications.push("");
      }),

    removeNestedSpecItem: (itemIndex, nestedIndex, specIndex) =>
      set((state) => {
        state.purchaseRequest.normalItem[itemIndex].specifications.nested[
          nestedIndex
        ].specifications.splice(specIndex, 1);
      }),

    updateNestedSpecItem: (itemIndex, nestedIndex, specIndex, value) =>
      set((state) => {
        state.purchaseRequest.normalItem[itemIndex].specifications.nested[
          nestedIndex
        ].specifications[specIndex] = value;
      }),

    // ============ SUBTITLE ACTIONS ============

    addSubtitle: (itemIndex) =>
      set((state) => {
        state.purchaseRequest.normalItem[
          itemIndex
        ].itemDescription.descriptions.push("");
      }),

    removeSubtitle: (itemIndex, subtitleIndex) =>
      set((state) => {
        state.purchaseRequest.normalItem[
          itemIndex
        ].itemDescription.descriptions.splice(subtitleIndex, 1);
      }),

    updateSubtitle: (itemIndex, subtitleIndex, value) =>
      set((state) => {
        state.purchaseRequest.normalItem[
          itemIndex
        ].itemDescription.descriptions[subtitleIndex] = value;
      }),

    // ============ RESET ============

    resetPurchaseRequest: () =>
      set((state) => {
        state.purchaseRequest = initialPurchaseRequest;
      }),

    reorderItems: (newItems) =>
      set((state) => ({
        purchaseRequest: {
          ...state.purchaseRequest,
          normalItem: newItems,
        },
      })),
  })),
);

export default useStore;
