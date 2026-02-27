import ComponentCustomInput from "@/components/custom-input/input";
import ComponentCustomBulletedTextarea from "@/components/custom-input/textarea-bullet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import useStore from "@/stores/global-state";
import { ChevronRight, Copy, Plus, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";

export function ItemTemplateLeaseVenueLot() {
  const lotItems = useStore((state) => state.purchaseRequest.lotItem);

  const duplicateLotItem = useStore((state) => state.duplicateLotItem);
  const deleteLotItem = useStore((state) => state.deleteLotItem);

  const addLotDescription = useStore((state) => state.addLotDescription);
  const duplicateLotDescription = useStore(
    (state) => state.duplicateLotDescription,
  );
  const deleteLotDescription = useStore((state) => state.deleteLotDescription);

  return (
    <>
      <div className="space-y-2">
        {lotItems.map((lotItem, lotItemIndex) => (
          <Accordion
            key={lotItem.id}
            type="single"
            collapsible
            className="w-full"
          >
            <AccordionItem
              value={`lot-item-${lotItemIndex}`}
              className="border! rounded-lg overflow-hidden"
            >
              <AccordionTrigger className="hover:no-underline group py-2.5 cursor-pointer px-4 data-[state=open]:bg-muted rounded-none">
                <div className="flex items-center justify-between flex-1">
                  <div className="flex items-center gap-2">
                    <ChevronRight className="transition-transform duration-200 size-4 group-data-[state=open]:rotate-90 text-muted-foreground" />

                    <span
                      className={cn(
                        "font-medium",
                        !lotItem.lotTitle &&
                          "text-muted-foreground font-normal text-xs italic",
                      )}
                    >
                      {lotItem.lotTitle || "Untitled Lot"}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <div
                      className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-950 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        duplicateLotItem(lotItemIndex);
                      }}
                    >
                      <Copy className="size-3.5 text-blue-500" />
                    </div>
                    <div
                      className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteLotItem(lotItemIndex);
                      }}
                    >
                      <Trash2 className="size-3.5 text-red-500" />
                    </div>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="p-4">
                <div className="space-y-4">
                  <ComponentCustomInput
                    path={`lotItem.${lotItemIndex}.lotTitle`}
                    label="Title"
                  />
                  <ComponentCustomBulletedTextarea
                    path={`lotItem.${lotItemIndex}.additionalInclustions`}
                    label="Additional Inclusions"
                  />

                  <div>
                    <div className="flex items-center justify-between">
                      <h3>Descriptions</h3>
                      <Button
                        variant={"outline"}
                        onClick={() => addLotDescription(lotItemIndex)}
                        className="text-xs cursor-pointer"
                      >
                        Add Description
                      </Button>
                    </div>
                    <div className="mt-3 space-y-2">
                      {lotItem.lotDescription.map(
                        (description, descriptionIndex) => (
                          <Accordion
                            key={descriptionIndex}
                            type="single"
                            collapsible
                            className="w-full"
                          >
                            <AccordionItem
                              value={`lot-item-${lotItemIndex}-description-${descriptionIndex}`}
                              className="border! rounded-lg overflow-hidden"
                            >
                              <AccordionTrigger className="hover:no-underline group py-2.5 cursor-pointer px-4 data-[state=open]:bg-muted rounded-none">
                                <div className="flex items-center justify-between flex-1">
                                  <div className="flex items-center gap-2">
                                    <ChevronRight className="transition-transform duration-200 size-4 group-data-[state=open]:rotate-90 text-muted-foreground" />

                                    <span
                                      className={cn(
                                        "font-medium",
                                        !description.title &&
                                          "text-muted-foreground font-normal text-xs italic",
                                      )}
                                    >
                                      {description.title ||
                                        "Untitled Description"}
                                    </span>
                                  </div>

                                  <div className="flex items-center">
                                    <div
                                      className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-950 rounded"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        duplicateLotDescription(
                                          lotItemIndex,
                                          descriptionIndex,
                                        );
                                      }}
                                    >
                                      <Copy className="size-3.5 text-blue-500" />
                                    </div>
                                    <div
                                      className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950 rounded"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteLotDescription(
                                          lotItemIndex,
                                          descriptionIndex,
                                        );
                                      }}
                                    >
                                      <Trash2 className="size-3.5 text-red-500" />
                                    </div>
                                  </div>
                                </div>
                              </AccordionTrigger>
                              <AccordionContent className="p-4">
                                <ComponentCustomInput
                                  path={`lotItem.${lotItemIndex}.lotDescription.${descriptionIndex}.title`}
                                  label="Title"
                                />

                                <div>
                                  <h3 className="uppercase my-4">Items</h3>
                                  <div className="space-y-2">
                                    {description.items.map(
                                      (
                                        descriptionItem,
                                        descriptionItemIndex,
                                      ) => (
                                        <Accordion
                                          type="single"
                                          collapsible
                                          key={descriptionItemIndex}
                                          className="w-full"
                                        >
                                          <AccordionItem
                                            value={`item-${descriptionItemIndex}`}
                                            className="border! overflow-hidden rounded-lg"
                                          >
                                            <AccordionTrigger className="hover:no-underline group py-2.5 cursor-pointer px-4 data-[state=open]:bg-muted rounded-none">
                                              <div className="flex items-center justify-between flex-1">
                                                <div className="flex items-center gap-2">
                                                  <ChevronRight className="transition-transform duration-200 size-4 group-data-[state=open]:rotate-90 text-muted-foreground" />

                                                  <span className="font-medium">
                                                    {/* {item.itemDescription
                                                      ?.title ||
                                                      "Untitled Item"} */}
                                                  </span>
                                                </div>

                                                <div className="flex items-center">
                                                  <div
                                                    className="p-1.5 hover:bg-blue-50 dark:hover:bg-blue-950 rounded"
                                                    // onClick={(e) => {
                                                    //   e.stopPropagation();
                                                    //   duplicateItem(itemIndex);
                                                    // }}
                                                  >
                                                    <Copy className="size-3.5 text-blue-500" />
                                                  </div>
                                                  <div
                                                    className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950 rounded"
                                                    // onClick={(e) => {
                                                    //   e.stopPropagation();
                                                    //   deleteItem(itemIndex);
                                                    // }}
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
                                                    path={`lotItem.${lotItemIndex}.lotDescription.${descriptionIndex}.items.${descriptionItemIndex}.stockPropertyNo`}
                                                  />
                                                  <ComponentCustomInput
                                                    label="Unit"
                                                    placeholder="Enter unit"
                                                    path={`lotItem.${lotItemIndex}.lotDescription.${descriptionIndex}.items.${descriptionItemIndex}.unit`}
                                                  />
                                                  <ComponentCustomInput
                                                    label="Quantity"
                                                    placeholder="Enter quantity"
                                                    path={`lotItem.${lotItemIndex}.lotDescription.${descriptionIndex}.items.${descriptionItemIndex}.quantity`}
                                                  />
                                                </div>

                                                <div className="col-span-2 space-y-4">
                                                  <ComponentCustomInput
                                                    label="Title"
                                                    placeholder="Enter item title"
                                                    path={`lotItem.${lotItemIndex}.lotDescription.${descriptionIndex}.items.${descriptionItemIndex}.itemDescription.title`}
                                                  />
                                                  <ComponentCustomBulletedTextarea
                                                    label="Descriptions"
                                                    placeholder="Enter item descriptions"
                                                    path={`lotItem.${lotItemIndex}.lotDescription.${descriptionIndex}.items.${descriptionItemIndex}.itemDescription.descriptions`}
                                                  />
                                                </div>

                                                <div className="grid grid-cols-2 gap-4 col-span-2">
                                                  <ComponentCustomInput
                                                    label="Unit Cost"
                                                    placeholder="0.00"
                                                    path={`lotItem.${lotItemIndex}.lotDescription.${descriptionIndex}.items.${descriptionItemIndex}.unitCost`}
                                                  />
                                                  <ComponentCustomInput
                                                    label="Total Cost"
                                                    placeholder="0.00"
                                                    path={`lotItem.${lotItemIndex}.lotDescription.${descriptionIndex}.items.${descriptionItemIndex}.totalCost`}
                                                    calculatedValue={
                                                      descriptionItem.quantity *
                                                      descriptionItem.unitCost
                                                    }
                                                    disabled
                                                    disabledReason="Automatically calculated from Quantity × Unit Cost"
                                                  />
                                                </div>

                                                <div className="col-span-2">
                                                  <Tabs
                                                    defaultValue="single"
                                                    className="w-full"
                                                  >
                                                    <div className="flex items-center justify-between">
                                                      <Label>
                                                        Item Specifications
                                                      </Label>
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
                                                        path={`lotItem.${lotItemIndex}.lotDescription.${descriptionIndex}.items.${descriptionItemIndex}.specifications.single`}
                                                      />
                                                    </TabsContent>
                                                    <TabsContent value="grouped">
                                                      <div
                                                        className={cn(
                                                          "space-y-2",
                                                          descriptionItem
                                                            .specifications
                                                            .nested.length >
                                                            0 && "mb-4 mt-2",
                                                        )}
                                                      >
                                                        {descriptionItem.specifications.nested.map(
                                                          (
                                                            nestedItem,
                                                            nestedItemIndex,
                                                          ) => (
                                                            <Accordion
                                                              key={
                                                                nestedItemIndex
                                                              }
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
                                                                        // onClick={(
                                                                        //   e,
                                                                        // ) => {
                                                                        //   e.stopPropagation();
                                                                        //   duplicateNestedSpec(
                                                                        //     itemIndex,
                                                                        //     nestedItemIndex,
                                                                        //   );
                                                                        // }}
                                                                      >
                                                                        <Copy className="size-3.5 text-blue-500" />
                                                                      </div>
                                                                      <div
                                                                        className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950 rounded"
                                                                        // onClick={(
                                                                        //   e,
                                                                        // ) => {
                                                                        //   e.stopPropagation();
                                                                        //   deleteNestedSpec(
                                                                        //     itemIndex,
                                                                        //     nestedItemIndex,
                                                                        //   );
                                                                        // }}
                                                                      >
                                                                        <Trash2 className="size-3.5 text-red-500" />
                                                                      </div>
                                                                    </div>
                                                                  </div>
                                                                </AccordionTrigger>

                                                                <AccordionContent className="pb-0 p-4 space-y-4">
                                                                  <ComponentCustomInput
                                                                    path={`lotItem.${lotItemIndex}.lotDescription.${descriptionIndex}.items.${descriptionItemIndex}.specifications.nested.${nestedItemIndex}.title`}
                                                                    label="Title"
                                                                  />
                                                                  <ComponentCustomBulletedTextarea
                                                                    label="Specifications"
                                                                    placeholder="Enter item descriptions"
                                                                    path={`lotItem.${lotItemIndex}.lotDescription.${descriptionIndex}.items.${descriptionItemIndex}.specifications.nested.${nestedItemIndex}.specifications`}
                                                                  />
                                                                </AccordionContent>
                                                              </AccordionItem>
                                                            </Accordion>
                                                          ),
                                                        )}
                                                      </div>
                                                      <Button
                                                        variant={"outline"}
                                                        // onClick={(e) =>
                                                        //   addNestedSpec(
                                                        //     itemIndex,
                                                        //   )
                                                        // }
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
                                      ),
                                    )}
                                  </div>
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          </Accordion>
                        ),
                      )}
                    </div>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}
      </div>
    </>
  );
}
