const { model, Schema } = require("mongoose");

const urlSchema = new Schema(
    {
        shortId: {
            type: String,
            required: true,
            unique: true,
        },
        redirectUrl: {
            type: String,
            required: true,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "users",
            required: true,
        },
        visitHistory: [{ timestamp: { type: Number } }],
    },
    { timestamps: true }
);

const Url = model("url", urlSchema);

module.exports = Url;
