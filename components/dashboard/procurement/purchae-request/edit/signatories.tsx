import ComponentCustomSelect from "@/components/custom-input/select";

export function PurchaseRequestEditSignatories() {
  return (
    <>
      <div className="border rounded-xl shadow">
        <div className="p-4 border-b">
          <div>
            <h3 className="font-medium">Signatories Details</h3>
            <p className="text-xs text-muted-foreground">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ipsam,
              consequatur?
            </p>
          </div>
        </div>

        {/* CARDS */}
        <div className="p-6 grid grid-cols-3 gap-4">
          {/* Requested By Card */}
          <div className="group pt-5 flex flex-col items-center justify-center w-full relative bg-card border rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20">
            {/* Header Badge */}
            <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2">
              <span className="inline-flex items-center gap-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-medium px-3 py-1 rounded-full border border-blue-500/20">
                <span className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
                Requested By
              </span>
            </div>

            {/* Select */}
            <div className="w-full p-4 pt-0">
              <ComponentCustomSelect
                label=""
                path="requestedBy"
                placeholder="Select person"
                searchable
                options={[
                  { value: "person1", label: "Kehn Justine J. Benliro" },
                  { value: "person2", label: "John Doe" },
                  { value: "person3", label: "Jane Smith" },
                ]}
              />
            </div>

            {/* Profile Section */}
            <div className="flex w-full p-4 pt-0 flex-col items-center text-center">
              {/* Avatar with Ring */}
              <div className="relative">
                <div className="size-20 rounded-full ring-4 ring-primary/10 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1504593811423-6dd665756598?w=500&auto=format&fit=crop&q=60"
                    alt="Profile"
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                {/* Status Indicator */}
                <div className="absolute bottom-1 right-1 size-4 bg-green-500 rounded-full border-2 border-background" />
              </div>

              {/* Name */}
              <h3 className="mt-4 font-semibold text-foreground">
                Kehn Justine J. Benliro
              </h3>

              {/* Role Pills */}
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                <span className="text-xs bg-muted px-2.5 py-1 rounded-full text-muted-foreground">
                  Software Engineer
                </span>
                <span className="text-xs bg-muted px-2.5 py-1 rounded-full text-muted-foreground">
                  IT Department
                </span>
              </div>

              {/* Signature Line */}
              <div className="mt-6 w-full">
                <div className="border-b-2 border-dashed border-muted-foreground/30 pb-1">
                  <span className="text-xs text-muted-foreground italic">
                    Digital Signature
                  </span>
                </div>
                <span className="text-xs text-muted-foreground mt-1 block">
                  Date: {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Approved By Card */}
          <div className="group pt-5 flex flex-col items-center justify-center w-full relative bg-card border rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20">
            {/* Header Badge */}
            <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2">
              <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium px-3 py-1 rounded-full border border-emerald-500/20">
                <span className="size-1.5 rounded-full bg-emerald-500" />
                Approved By
              </span>
            </div>

            {/* Select */}
            <div className="w-full p-4 pt-0">
              <ComponentCustomSelect
                label=""
                path="requestedBy"
                placeholder="Select person"
                searchable
                options={[
                  { value: "person1", label: "Kehn Justine J. Benliro" },
                  { value: "person2", label: "John Doe" },
                  { value: "person3", label: "Jane Smith" },
                ]}
              />
            </div>

            {/* Profile Section */}
            <div className="flex w-full p-4 pt-0 flex-col items-center text-center">
              {/* Avatar with Ring */}
              <div className="relative">
                <div className="size-20 rounded-full ring-4 ring-primary/10 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1504593811423-6dd665756598?w=500&auto=format&fit=crop&q=60"
                    alt="Profile"
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                {/* Status Indicator */}
                <div className="absolute bottom-1 right-1 size-4 bg-green-500 rounded-full border-2 border-background" />
              </div>

              {/* Name */}
              <h3 className="mt-4 font-semibold text-foreground">
                Kehn Justine J. Benliro
              </h3>

              {/* Role Pills */}
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                <span className="text-xs bg-muted px-2.5 py-1 rounded-full text-muted-foreground">
                  Software Engineer
                </span>
                <span className="text-xs bg-muted px-2.5 py-1 rounded-full text-muted-foreground">
                  IT Department
                </span>
              </div>

              {/* Signature Line */}
              <div className="mt-6 w-full">
                <div className="border-b-2 border-dashed border-muted-foreground/30 pb-1">
                  <span className="text-xs text-muted-foreground italic">
                    Digital Signature
                  </span>
                </div>
                <span className="text-xs text-muted-foreground mt-1 block">
                  Date: {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          {/* Certified By Card */}
          <div className="group pt-5 flex flex-col items-center justify-center w-full relative bg-card border rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-primary/5 hover:border-primary/20">
            {/* Header Badge */}
            <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2">
              <span className="inline-flex items-center gap-1.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-medium px-3 py-1 rounded-full border border-purple-500/20">
                <span className="size-1.5 rounded-full bg-purple-500" />
                Inclusioned By
              </span>
            </div>

            {/* Select */}
            <div className="w-full p-4 pt-0">
              <ComponentCustomSelect
                label=""
                path="requestedBy"
                placeholder="Select person"
                searchable
                options={[
                  { value: "person1", label: "Kehn Justine J. Benliro" },
                  { value: "person2", label: "John Doe" },
                  { value: "person3", label: "Jane Smith" },
                ]}
              />
            </div>

            {/* Profile Section */}
            <div className="flex w-full p-4 pt-0 flex-col items-center text-center">
              {/* Avatar with Ring */}
              <div className="relative">
                <div className="size-20 rounded-full ring-4 ring-primary/10 overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1504593811423-6dd665756598?w=500&auto=format&fit=crop&q=60"
                    alt="Profile"
                    className="size-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                </div>
                {/* Status Indicator */}
                <div className="absolute bottom-1 right-1 size-4 bg-green-500 rounded-full border-2 border-background" />
              </div>

              {/* Name */}
              <h3 className="mt-4 font-semibold text-foreground">
                Kehn Justine J. Benliro
              </h3>

              {/* Role Pills */}
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                <span className="text-xs bg-muted px-2.5 py-1 rounded-full text-muted-foreground">
                  Software Engineer
                </span>
                <span className="text-xs bg-muted px-2.5 py-1 rounded-full text-muted-foreground">
                  IT Department
                </span>
              </div>

              {/* Signature Line */}
              <div className="mt-6 w-full">
                <div className="border-b-2 border-dashed border-muted-foreground/30 pb-1">
                  <span className="text-xs text-muted-foreground italic">
                    Digital Signature
                  </span>
                </div>
                <span className="text-xs text-muted-foreground mt-1 block">
                  Date: {new Date().toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
