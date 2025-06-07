const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Product = mongoose.model("product");

const pick = (field) =>
  Array.isArray(field) ? (field.length ? field[0] : undefined) : field;

router.post("/df_fulfillment", async (req, res) => {
  try {
    const { queryResult } = req.body;
    const intentName = queryResult.intent.displayName;
    const params = queryResult.parameters;

    console.log("INTENT:", intentName);
    console.log("PARAMS:", JSON.stringify(params, null, 2));

    const supported = [
      "recommend_items",
      "filter_products",
      "browse_products",
      "search-product-by-item",
    ];

    if (!supported.includes(intentName)) {
      return res.json({
        fulfillmentText: "Intent not supported.",
      });
    }

    const map = {
      clothing_item: ["productName", "name"],
      color: "productColor",
      clothing_size: ["productSize", "size"],
      season: "season",
      clothing_brand: "productBrand",
      gender: "catName",
      material_type: "materialType",
      style_type: "styleType",
    };

    const and = [];
    Object.entries(map).forEach(([param, field]) => {
      if (!params[param]) return;

      const regexPattern =
        param === "gender" ? `^${params[param]}$` : params[param];
      if (Array.isArray(field)) {
        and.push({
          $or: field.map((f) => ({
            [f]: { $regex: regexPattern, $options: "i" },
          })),
        });
      } else {
        and.push({
          [field]: { $regex: regexPattern, $options: "i" },
        });
      }
    });

    const filter = and.length ? { $and: and } : {};

    const products = await Product.aggregate([
      { $match: filter },
      { $sample: { size: 4 } },
    ]);

    if (!products.length) {
      return res.json({
        fulfillmentText: "No matching products found. Try different filters!",
      });
    }

    const cards = products.map((p) => {
      const title = p.productName || p.name || "Product";
      const image =
        pick(p.images)?.trim() ||
        (p.imageUri || "").trim() ||
        "https://via.placeholder.com/300x200";
      const category = p.catName || p.subCatName || "General";
      const price = p.price ? `$${p.price}` : "$N/A";

      return {
        type: "card",
        title,
        subtitle: `Category: ${category} • ${price}`,
        image: {
          src: { rawUrl: image },
        },
        buttons: [
          {
            text: "GET NOW",
            link: p.link || "#",
          },
        ],
      };
    });

    const item = params.clothing_item || "items";

    res.json({
      fulfillmentMessages: [
        {
          text: {
            text: [`Here are some ${item} you may like:`],
          },
        },
        {
          payload: {
            richContent: [cards],
          },
        },
      ],
    });
  } catch (err) {
    console.error("Fulfillment error:", err);
    res.json({
      fulfillmentText:
        "Oops! Something went wrong while loading recommendations.",
    });
  }
});

module.exports = router;
