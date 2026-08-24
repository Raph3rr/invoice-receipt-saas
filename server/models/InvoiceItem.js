// InvoiceItem model — schema to be implemented in the corresponding development phase.
// See Development Guide Section 24 (Core Model Fields) for planned fields.

import mongoose from "mongoose";

const InvoiceItemSchema = new mongoose.Schema(
  {
    // TODO: define fields
  },
  { timestamps: true }
);

export default mongoose.model("InvoiceItem", InvoiceItemSchema);
