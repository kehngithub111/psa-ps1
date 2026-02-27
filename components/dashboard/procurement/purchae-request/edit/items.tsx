import {
  ChevronRight,
  Copy,
  GripVerticalIcon,
  Package,
  Plus,
  Trash2,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Sortable,
  SortableItem,
  SortableItemHandle,
  SortableOverlay,
} from "@/components/reui/sortable";
import useStore from "@/stores/global-state";
import ComponentCustomInput from "@/components/custom-input/input";
import ComponentCustomBulletedTextarea from "@/components/custom-input/textarea-bullet";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export function PurchaseRequestEditItemDetails() {
  const { procurementMode } = useStore((state) => state.purchaseRequest);
  const items = useStore((state) => state.purchaseRequest.normalItem);

  const addItem = useStore((state) => state.addItem);
  const deleteItem = useStore((state) => state.deleteItem);
  const duplicateItem = useStore((state) => state.duplicateItem);
  const reorderItems = useStore((state) => state.reorderItems);

  const addNestedSpec = useStore((state) => state.addNestedSpec);
  const duplicateNestedSpec = useStore((state) => state.duplicateNestedSpec);
  const deleteNestedSpec = useStore((state) => state.removeNestedSpec);

  const handleReorder = (reorderedItems: typeof items) => {
    reorderItems(reorderedItems);
  };

  const getItemValue = (item: (typeof items)[number]): string => item.id ?? "";

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
          {items.length > 0 && (
            <Button variant="outline" onClick={addItem}>
              Add Item
            </Button>
          )}
        </div>
      </div>
      <div className="p-4">
        {items.length === 0 && (
          <div className="flex flex-col border border-dashed rounded-lg items-center justify-center py-8 px-4">
            <div className="flex items-center justify-center size-16 rounded-full bg-muted/50 mb-4">
              <Package className="size-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No items yet</h3>
            <p className="text-sm text-muted-foreground mb-6 text-center max-w-sm">
              Get started by adding your first procurement item to the list.
            </p>
            <Button onClick={addItem} className="gap-2">
              <Plus className="size-4" />
              Add First Item
            </Button>
          </div>
        )}

        {items.length > 0 && (
          <Sortable
            value={items}
            onValueChange={handleReorder}
            getItemValue={getItemValue}
            strategy="vertical"
            overlay={false} // 
            className="space-y-2"
          >
            {items.map((item) => {
              const itemId = item.id ?? "";
              const itemIndex = items.findIndex((i) => (i.id ?? "") === itemId);

              return (
                <SortableItem key={itemId} value={itemId}>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem
                      value={`item-${itemId}`}
                      className="border! overflow-hidden rounded-lg"
                    >
                      <AccordionTrigger className="hover:no-underline group py-2.5 cursor-pointer px-4 data-[state=open]:bg-muted rounded-none">
                        <div className="flex items-center justify-between flex-1">
                          <div className="flex items-center gap-2">
                            <SortableItemHandle
                              className="text-muted-foreground hover:text-foreground"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <GripVerticalIcon className="h-4 w-4" />
                            </SortableItemHandle>

                            <ChevronRight className="transition-transform duration-200 size-4 group-data-[state=open]:rotate-90 text-muted-foreground" />

                            <span className="font-medium">
                              {item.itemDescription?.title || "Untitled Item"}
                            </span>
                          </div>

                          <div className="flex items-center">
                            <div
                              className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-950 rounded"
                              onClick={(e) => {
                                e.stopPropagation();
                                duplicateItem(itemIndex);
                              }}
                            >
                              <Copy className="size-3.5 text-blue-500" />
                            </div>
                            <div
                              className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950 rounded"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteItem(itemIndex);
                              }}
                            >
                              <Trash2 className="size-3.5 text-red-500" />
                            </div>
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="p-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="grid grid-cols-3 gap-4 col-span-2">
                            <ComponentCustomInput
                              label="Stock Property No."
                              placeholder="Enter stock property no"
                              path={`normalItem.${itemIndex}.stockPropertyNo`}
                            />
                            <ComponentCustomInput
                              label="Unit"
                              placeholder="Enter unit"
                              path={`normalItem.${itemIndex}.unit`}
                            />
                            <ComponentCustomInput
                              label="Quantity"
                              placeholder="Enter quantity"
                              path={`normalItem.${itemIndex}.quantity`}
                            />
                          </div>

                          <div className="col-span-2 space-y-4">
                            <ComponentCustomInput
                              label="Title"
                              placeholder="Enter item title"
                              path={`normalItem.${itemIndex}.itemDescription.title`}
                            />
                            <ComponentCustomBulletedTextarea
                              label="Descriptions"
                              placeholder="Enter item descriptions"
                              path={`normalItem.${itemIndex}.itemDescription.descriptions`}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4 col-span-2">
                            <ComponentCustomInput
                              label="Unit Cost"
                              placeholder="0.00"
                              path={`normalItem.${itemIndex}.unitCost`}
                            />
                            <ComponentCustomInput
                              label="Total Cost"
                              placeholder="0.00"
                              path={`normalItem.${itemIndex}.totalCost`}
                              calculatedValue={item.quantity * item.unitCost}
                              disabled
                              disabledReason="Automatically calculated from Quantity × Unit Cost"
                            />
                          </div>

                          <div className="col-span-2">
                            <Tabs defaultValue="single" className="w-full">
                              <div className="flex items-center justify-between">
                                <Label>Item Specifications</Label>
                                <TabsList>
                                  <TabsTrigger value="single">
                                    Single
                                  </TabsTrigger>
                                  <TabsTrigger value="grouped">
                                    Grouped
                                  </TabsTrigger>
                                </TabsList>
                              </div>
                              <TabsContent value="single">
                                <ComponentCustomBulletedTextarea
                                  label=""
                                  placeholder="Enter item descriptions"
                                  path={`normalItem.${itemIndex}.specifications.single`}
                                />
                              </TabsContent>
                              <TabsContent value="grouped">
                                <div className={cn("space-y-2", item.specifications.nested.length > 0 && "mb-4 mt-2")}>
                                  {item.specifications.nested.map(
                                    (nestedItem, nestedItemIndex) => (
                                      <Accordion
                                        key={nestedItemIndex}
                                        type="single"
                                        collapsible
                                        className="w-full"
                                      >
                                        <AccordionItem
                                          className="border! overflow-hidden rounded-lg"
                                          value={`nested-${nestedItemIndex}`}
                                        >
                                          <AccordionTrigger className="hover:no-underline group py-2.5 cursor-pointer px-4 data-[state=open]:bg-muted rounded-none">
                                            <div className="flex items-center justify-between flex-1">
                                              <div className="flex items-center gap-2">
                                                <ChevronRight className="transition-transform duration-200 size-4 group-data-[state=open]:rotate-90 text-muted-foreground" />

                                                <span
                                                  className={cn(
                                                    "font-medium",
                                                    !nestedItem.title &&
                                                      "text-muted-foreground font-normal text-xs",
                                                  )}
                                                >
                                                  {nestedItem?.title ||
                                                    "Untitled Grouped Specification"}
                                                </span>
                                              </div>

                                              <div className="flex items-center">
                                                <div
                                                  className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-950 rounded"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    duplicateNestedSpec(itemIndex, nestedItemIndex);
                                                  }}
                                                >
                                                  <Copy className="size-3.5 text-blue-500" />
                                                </div>
                                                <div
                                                  className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950 rounded"
                                                  onClick={(e) => {
                                                    e.stopPropagation();
                                                    deleteNestedSpec(itemIndex, nestedItemIndex)
                                                  }}
                                                >
                                                  <Trash2 className="size-3.5 text-red-500" />
                                                </div>
                                              </div>
                                            </div>
                                          </AccordionTrigger>

                                          <AccordionContent className="pb-0 p-4 space-y-4">
                                            <ComponentCustomInput
                                              path={`normalItem.${itemIndex}.specifications.nested.${nestedItemIndex}.title`}
                                              label="Title"
                                            />
                                            <ComponentCustomBulletedTextarea
                                              label="Specifications"
                                              placeholder="Enter item descriptions"
                                              path={`normalItem.${itemIndex}.specifications.nested.${nestedItemIndex}.specifications`}
                                            />
                                          </AccordionContent>
                                        </AccordionItem>
                                      </Accordion>
                                    ),
                                  )}
                                </div>
                                <Button
                                  variant={"outline"}
                                  onClick={(e) => addNestedSpec(itemIndex)}
                                  className="w-full cursor-pointer"
                                >
                                  <Plus />
                                  New Group Specification
                                </Button>
                              </TabsContent>
                            </Tabs>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </SortableItem>
              );
            })}

            {/* Custom Overlay - Now the only overlay */}
            <SortableOverlay>
              {({ value }) => {
                const activeItem = items.find(
                  (item) => (item.id ?? "") === value,
                );
                if (!activeItem) return null;

                return (
                  <div className="bg-background border border-primary/50 rounded-lg p-4 py-1.5 shadow-2xl ring-2 ring-primary/20">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center size-8 rounded-md bg-primary/10">
                        <GripVerticalIcon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {activeItem.itemDescription?.title || "Untitled Item"}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              }}
            </SortableOverlay>
          </Sortable>
        )}
      </div>
    </div>
  );
}
