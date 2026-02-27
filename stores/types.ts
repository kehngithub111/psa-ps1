export interface Schedule {
  dateStart: Date | number | undefined;
  dateEnd: Date | number | undefined;
  timeStart: string | number;
  timeEnd: string | number;
}

export interface Activity {
  title: string;
  schedule: Schedule;
  venue: string;
  purpose: string;
}

export interface NestedSpecification {
  title: string;
  specifications: string[];
}

export interface Specifications {
  single: string[];
  nested: NestedSpecification[];
}

export interface ItemDescription {
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

export interface LotDescription {
  title: string;
  items: NormalItem[];
}

export interface LotItem {
  id?: string;
  lotTitle: string;
  additionalInclustions: string[];
  lotDescription: LotDescription[];
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
  lotItem: LotItem[];

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
