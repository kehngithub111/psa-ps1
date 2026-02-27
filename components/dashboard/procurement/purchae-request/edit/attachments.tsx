import { ComponentCustomFileUpload } from "@/components/patterns/file-upload";

export function PurchaseRequestEditAttachmentDetails() {
  return (
    <>
      <div className="border rounded-xl shadow">
        <div className="p-4 border-b">
          <div>
            <h3 className="font-medium">Attachment Details</h3>
            <p className="text-xs text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam,
              consequatur?
            </p>
          </div>
        </div>

        <div className="p-4">   
          <ComponentCustomFileUpload />
        </div>
      </div>
    </>
  );
}
