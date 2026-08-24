// Stub controller — implemented in later development phases (see Development Guide, Section 30).

export const notImplemented = async (req, res) => {
  res.status(501).json({ success: false, message: "Not implemented yet" });
};
