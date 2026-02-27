"use client";

import { Button } from "@/components/ui/button";
import useStore from "@/stores/global-state";
import { PurchaseRequestEditGeneralInformation } from "@/components/dashboard/procurement/purchae-request/edit/general";
import { PurchaseRequestEditActivityDetails } from "@/components/dashboard/procurement/purchae-request/edit/activity";
import { PurchaseRequestEditOtherDetails } from "@/components/dashboard/procurement/purchae-request/edit/others";
import { PurchaseRequestEditDeliveryDetails } from "@/components/dashboard/procurement/purchae-request/edit/delivery";
import { PurchaseRequestEditItemDetails } from "@/components/dashboard/procurement/purchae-request/edit/items";
import { PurchaseRequestEditSignatories } from "./signatories";
import { PurchaseRequestEditAttachmentDetails } from "./attachments";

export function PurchaseRequestEditMainContainer() {
  const purchaseRequest = useStore((state) => state.purchaseRequest);

  const handleSubmitPrForApproval = () => {
    console.log(purchaseRequest);
  };
  return (
    <>
      <div className="max-w-250 w-full mx-auto py-4 space-y-4">
        <PurchaseRequestEditGeneralInformation />
        {/* <PurchaseRequestEditActivityDetails /> */}
        <PurchaseRequestEditItemDetails />
        {/* <PurchaseRequestEditOtherDetails /> */}
        {/* <PurchaseRequestEditDeliveryDetails /> */}
        {/* <PurchaseRequestEditAttachmentDetails /> */}
        {/* <PurchaseRequestEditSignatories /> */}

        <Button onClick={handleSubmitPrForApproval}>Submit for Approval</Button>
      </div>
    </>
  );
}
