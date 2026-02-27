import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { current } from "immer";
import { PathValue, PurchaseRequestPath, setNestedValue } from "./paths";
import {
  LotDescription,
  LotItem,
  NestedSpecification,
  NormalItem,
  PurchaseRequest,
  Specifications,
} from "./types";
import {
  createEmptyDescription,
  createEmptyItem,
  createEmptyLotItems,
  createEmptyNestedSpec,
  generateId,
  initialPurchaseRequest,
} from "./initial-value";

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

  // Lot Item Actions (to be implemented)
  addLotItem: () => void;
  duplicateLotItem: (lotIndex: number) => void;
  deleteLotItem: (lotIndex: number) => void;

  addLotDescription: (lotIndex: number) => void;
  deleteLotDescription: (lotIndex: number, descriptionIndex: number) => void;
  duplicateLotDescription: (lotIndex: number, descriptionIndex: number) => void;
}

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

    // =========== LOT ITEM ACTIONS ============
    addLotItem: () =>
      set((state) => {
        state.purchaseRequest.lotItem.push(createEmptyLotItems());
      }),

    duplicateLotItem: (index: number) =>
      set((state) => {
        const items = state.purchaseRequest.lotItem;
        const originalItem = items[index];

        if (!originalItem) return;

        const plainItem = current(originalItem);
        const duplicatedItem: LotItem = {
          ...JSON.parse(JSON.stringify(plainItem)),
          id: generateId(),
        };

        items.splice(index + 1, 0, duplicatedItem);
      }),

    deleteLotItem: (index) =>
      set((state) => {
        state.purchaseRequest.lotItem.splice(index, 1);
      }),

    addLotDescription: (lotIndex: number) =>
      set((state) => {
        state.purchaseRequest.lotItem[lotIndex].lotDescription.push(
          createEmptyDescription(),
        );
      }),

    duplicateLotDescription: (lotIndex: number, descriptionIndex: number) =>
      set((state) => {
        const lotItem = state.purchaseRequest.lotItem[lotIndex];
        const originalItem = lotItem.lotDescription[descriptionIndex];

        if (!originalItem) return;

        const plainItem = current(originalItem);
        const duplicatedItem: LotDescription = {
          ...JSON.parse(JSON.stringify(plainItem)),
          id: generateId(),
        };

        lotItem.lotDescription.splice(descriptionIndex + 1, 0, duplicatedItem);
      }),

    deleteLotDescription: (lotIndex: number, descriptionIndex: number) =>
      set((state) => {
        state.purchaseRequest.lotItem[lotIndex].lotDescription.splice(
          descriptionIndex,
          1,
        );
      }),
  })),
);

export default useStore;
