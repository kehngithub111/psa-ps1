import { create } from "domain";
import {
  LotItem,
  NestedSpecification,
  NormalItem,
  PurchaseRequest,
  Specifications,
} from "./types";

export const generateId = () =>
  `item-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

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

export const createEmptyDescription = () => ({
  title: "This is a sample title for this item",
  items: [createEmptyItem()],
});

export const createEmptyLotItems = (): LotItem => ({
  id: generateId(),
  lotTitle: "Lot Title",
  additionalInclustions: ["Additional Inclusion 1", "Additional Inclusion 2"],
  lotDescription: [createEmptyDescription()],
});

export const initialPurchaseRequest: PurchaseRequest = {
  prNumber: "",
  fundCluster: "FC",
  rcc: "RCC",
  draftDate: undefined,
  procurementMode: "lease_venue_lot",
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
  lotItem: [createEmptyLotItems()],

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
