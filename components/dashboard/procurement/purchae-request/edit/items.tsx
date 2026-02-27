import { Package, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import useStore from "@/stores/global-state";
import { ItemTemplateSmallValue } from "./item-templates/small-value";
import { ItemTemplateLeaseVenueLot } from "./item-templates/lease-venue-lot";

export function PurchaseRequestEditItemDetails() {
  const { procurementMode } = useStore((state) => state.purchaseRequest);

  const normalItems = useStore((state) => state.purchaseRequest.normalItem);
  const lotItems = useStore((state) => state.purchaseRequest.lotItem);

  const addNormalItem = useStore((state) => state.addItem);
  const addLotItem = useStore((state) => state.addLotItem);

  return (
    <div className="border rounded-xl shadow">
      <div className="p-4 border-b flex items-center justify-between">
        <div>
          <h3 className="font-medium">Item Details {procurementMode}</h3>
          <p className="text-xs text-muted-foreground">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam,
            consequatur?
          </p>
        </div>
        <div>
          <Button
              variant="outline"
              onClick={() => {
                if (procurementMode === "small_value") {
                  addNormalItem();
                } else if (procurementMode === "lease_venue_lot") {
                  addLotItem(); // Implement this function in your store
                }
              }}
            >
              Add Item
            </Button>
        </div>
      </div>
      <div className="p-4">
        {/* {(normalItems.length === 0 || lotItems.length === 0) && (
          <div className="flex flex-col border border-dashed rounded-lg items-center justify-center py-8 px-4">
            <div className="flex items-center justify-center size-16 rounded-full bg-muted/50 mb-4">
              <Package className="size-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No items yet</h3>
            <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
              Get started by adding your first procurement item to the list.
            </p>
            <Button
              onClick={() => {
                if (procurementMode === "small_value") {
                  addNormalItem();
                }
              }}
              className="gap-2"
            >
              <Plus className="size-4" />
              Add First Item
            </Button>
          </div>
        )} */}

        {procurementMode === "small_value" && normalItems.length > 0 && (
          <ItemTemplateSmallValue />
        )}

        {procurementMode === "lease_venue_lot" && lotItems.length > 0 && (
          <ItemTemplateLeaseVenueLot />
        )}
      </div>
    </div>
  );
}
