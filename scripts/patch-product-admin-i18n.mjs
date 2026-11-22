import fs from "node:fs";
import path from "node:path";

const locales = ["en", "hi"];

const navPatch = {
  productMaterials: ["Materials", "सामग्री"],
  productGrades: ["Grades", "ग्रेड"],
  productStandards: ["Standards", "मानक"],
  productFinishes: ["Finishes", "फिनिश"],
  productThreads: ["Threads", "थ्रेड"],
  productHeadTypes: ["Head types", "हेड प्रकार"],
  productDriveTypes: ["Drive types", "ड्राइव प्रकार"],
  productIndustries: ["Industries", "उद्योग"],
  productApplications: ["Applications", "अनुप्रयोग"],
  productPackaging: ["Packaging", "पैकेजिंग"],
  productAttributes: ["Product attributes", "उत्पाद विशेषताएँ"],
};

const pageIds = [
  "productSizesCreate",
  "productSizesView",
  "productSizesEdit",
  "productMaterials",
  "productMaterialsCreate",
  "productMaterialsView",
  "productMaterialsEdit",
  "productGrades",
  "productGradesCreate",
  "productGradesView",
  "productGradesEdit",
  "productStandards",
  "productStandardsCreate",
  "productStandardsView",
  "productStandardsEdit",
  "productFinishes",
  "productFinishesCreate",
  "productFinishesView",
  "productFinishesEdit",
  "productThreads",
  "productThreadsCreate",
  "productThreadsView",
  "productThreadsEdit",
  "productHeadTypes",
  "productHeadTypesCreate",
  "productHeadTypesView",
  "productHeadTypesEdit",
  "productDriveTypes",
  "productDriveTypesCreate",
  "productDriveTypesView",
  "productDriveTypesEdit",
  "productIndustries",
  "productIndustriesCreate",
  "productIndustriesView",
  "productIndustriesEdit",
  "productApplications",
  "productApplicationsCreate",
  "productApplicationsView",
  "productApplicationsEdit",
  "productPackaging",
  "productPackagingCreate",
  "productPackagingView",
  "productPackagingEdit",
  "productAttributes",
  "productAttributesCreate",
  "productAttributesView",
  "productAttributesEdit",
];

const mastersCommon = {
  searchLabel: ["Search", "खोजें"],
  searchPlaceholder: ["Search by name, slug, or code", "नाम, स्लग या कोड से खोजें"],
  createAction: ["Create", "बनाएँ"],
  table: {
    caption: ["Master records", "मास्टर रिकॉर्ड"],
    name: ["Name", "नाम"],
    code: ["Code", "कोड"],
    display: ["Display", "प्रदर्शन"],
    dimension: ["Dimension", "आयाम"],
    valueType: ["Type", "प्रकार"],
    configuration: ["Specs / Variants", "विनिर्देश / वेरिएंट"],
    status: ["Status", "स्थिति"],
    sortOrder: ["Sort order", "क्रम"],
    updated: ["Updated", "अपडेट"],
    actions: ["Actions", "कार्रवाई"],
  },
  status: { active: ["Active", "सक्रिय"], inactive: ["Inactive", "निष्क्रिय"] },
  actions: {
    view: ["View", "देखें"],
    edit: ["Edit", "संपादित करें"],
    delete: ["Delete", "हटाएँ"],
  },
  empty: { title: ["No records yet", "अभी कोई रिकॉर्ड नहीं"], body: ["Create the first record.", "पहला रिकॉर्ड बनाएँ।"] },
  errors: {
    title: ["Could not complete request", "अनुरोध पूरा नहीं हो सका"],
    load: ["Try again in a moment.", "कुछ समय बाद पुनः प्रयास करें।"],
    generic: ["Something went wrong.", "कुछ गलत हो गया।"],
  },
  delete: {
    confirm: {
      title: ["Delete record?", "रिकॉर्ड हटाएँ?"],
      description: ['"{name}" will be removed.', '"{name}" हटा दिया जाएगा।'],
      confirm: ["Delete", "हटाएँ"],
    },
    success: { title: ["Record deleted", "रिकॉर्ड हटाया गया"], body: ["The record was removed.", "रिकॉर्ड हटा दिया गया।"] },
  },
  create: {
    loading: ["Loading…", "लोड हो रहा है…"],
    fields: {
      name: ["Name", "नाम"],
      slug: ["Slug", "स्लग"],
      code: ["Code", "कोड"],
      summary: ["Summary", "सारांश"],
      image: ["Image", "छवि"],
      display: ["Display", "प्रदर्शन"],
      dimension: ["Dimension", "आयाम"],
      unit: ["Unit", "इकाई"],
      valueType: ["Value type", "मान प्रकार"],
      options: ["Options", "विकल्प"],
      status: ["Status", "स्थिति"],
      sortOrder: ["Sort order", "क्रम"],
    },
    placeholders: {
      name: ["Enter a name", "नाम दर्ज करें"],
      slug: ["record-slug", "record-slug"],
      code: ["CODE", "CODE"],
      summary: ["Short summary", "संक्षिप्त सारांश"],
      options: ["One option per line", "प्रति पंक्ति एक विकल्प"],
    },
    valueTypes: {
      text: ["Text", "पाठ"],
      number: ["Number", "संख्या"],
      boolean: ["Boolean", "बूलियन"],
      select: ["Select", "चयन"],
      multiSelect: ["Multi-select", "बहु-चयन"],
      dimension: ["Dimension", "आयाम"],
    },
    status: { active: ["Active", "सक्रिय"], inactive: ["Inactive", "निष्क्रिय"] },
    image: {
      drop: ["Drop image here", "छवि यहाँ छोड़ें"],
      browse: ["Browse", "ब्राउज़"],
      change: ["Change image", "छवि बदलें"],
      remove: ["Remove", "हटाएँ"],
      hint: ["JPG or PNG, up to 2 MB", "JPG या PNG, अधिकतम 2 MB"],
    },
    save: ["Save", "सहेजें"],
    saving: ["Saving…", "सहेजा जा रहा है…"],
    cancelAction: ["Cancel", "रद्द करें"],
    success: { title: ["Saved", "सहेजा गया"], body: ["The record was saved.", "रिकॉर्ड सहेजा गया।"] },
    errors: {
      title: ["Could not save", "सहेज नहीं सका"],
      generic: ["Try again.", "पुनः प्रयास करें।"],
      validation: ["Fix highlighted fields.", "चिह्नित फ़ील्ड ठीक करें।"],
      required: ["This field is required.", "यह फ़ील्ड आवश्यक है।"],
      invalidSlug: ["Use lowercase letters, numbers, and hyphens.", "छोटे अक्षर, संख्या और हाइफ़न का उपयोग करें।"],
    },
    notFound: { title: ["Not found", "नहीं मिला"], body: ["This record may have been removed.", "यह रिकॉर्ड हटाया गया हो सकता है।"] },
  },
  edit: {},
  view: {
    loading: ["Loading…", "लोड हो रहा है…"],
    noImage: ["No image uploaded", "कोई छवि अपलोड नहीं"],
    cancelAction: ["Cancel", "रद्द करें"],
    editAction: ["Edit", "संपादित करें"],
    fields: {
      name: ["Name", "नाम"],
      slug: ["Slug", "स्लग"],
      code: ["Code", "कोड"],
      summary: ["Summary", "सारांश"],
      display: ["Display", "प्रदर्शन"],
      dimension: ["Dimension", "आयाम"],
      unit: ["Unit", "इकाई"],
      valueType: ["Value type", "मान प्रकार"],
      options: ["Options", "विकल्प"],
      status: ["Status", "स्थिति"],
      sortOrder: ["Sort order", "क्रम"],
      created: ["Created", "बनाया गया"],
      updated: ["Updated", "अपडेट"],
    },
    notFound: { title: ["Not found", "नहीं मिला"], body: ["This record may have been removed.", "यह रिकॉर्ड हटाया गया हो सकता है।"] },
  },
};

mastersCommon.edit = JSON.parse(JSON.stringify(mastersCommon.create));
mastersCommon.edit.save = ["Update", "अपडेट"];
mastersCommon.edit.saving = ["Updating…", "अपडेट हो रहा है…"];

function localize(node, localeIndex) {
  if (Array.isArray(node) && node.length === 2 && typeof node[0] === "string") {
    return node[localeIndex];
  }
  if (typeof node === "object" && node !== null) {
    return Object.fromEntries(Object.entries(node).map(([key, value]) => [key, localize(value, localeIndex)]));
  }
  return node;
}

for (const locale of locales) {
  const localeIndex = locale === "en" ? 0 : 1;
  const filePath = path.join(process.cwd(), `src/i18n/locales/${locale}/admin.json`);
  const admin = JSON.parse(fs.readFileSync(filePath, "utf8"));

  for (const [key, labels] of Object.entries(navPatch)) {
    admin.nav[key] = labels[localeIndex];
  }

  for (const pageId of pageIds) {
    const title = pageId.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
    admin.header.pages[pageId] = {
      title: title.trim(),
      lede: localeIndex === 0 ? "Manage product catalogue master data." : "उत्पाद कैटलॉग मास्टर डेटा प्रबंधित करें।",
    };
  }

  admin.products.masters = { common: localize(mastersCommon, localeIndex) };

  admin.products.catalog = {
    listing: localize(
      {
        toolbarTitle: ["All products", "सभी उत्पाद"],
        createAction: ["Create product", "उत्पाद बनाएँ"],
        filters: {
          search: ["Search", "खोजें"],
          searchPlaceholder: ["Name, code, SKU, category…", "नाम, कोड, SKU, श्रेणी…"],
          category: ["Category", "श्रेणी"],
          type: ["Product type", "उत्पाद प्रकार"],
          status: ["Status", "स्थिति"],
          featured: ["Featured", "विशेष"],
          all: ["All", "सभी"],
        },
        table: {
          caption: ["Catalogue products", "कैटलॉग उत्पाद"],
          image: ["Image", "छवि"],
          name: ["Product", "उत्पाद"],
          productCode: ["Product code", "उत्पाद कोड"],
          category: ["Category", "श्रेणी"],
          type: ["Type", "प्रकार"],
          variants: ["Variants", "वेरिएंट"],
          status: ["Status", "स्थिति"],
          featured: ["Featured", "विशेष"],
          updated: ["Updated", "अपडेट"],
          actions: ["Actions", "कार्रवाई"],
        },
        status: { active: ["Active", "सक्रिय"], draft: ["Draft", "ड्राफ्ट"], archived: ["Archived", "संग्रहीत"] },
        options: { yes: ["Yes", "हाँ"], no: ["No", "नहीं"] },
        actions: { view: ["View", "देखें"], edit: ["Edit", "संपादित"], delete: ["Delete", "हटाएँ"] },
        errors: {
          title: ["Could not load products", "उत्पाद लोड नहीं हो सके"],
          load: ["Try again.", "पुनः प्रयास करें।"],
          generic: ["Something went wrong.", "कुछ गलत हो गया।"],
        },
        delete: {
          confirm: {
            title: ["Delete product?", "उत्पाद हटाएँ?"],
            description: ['"{name}" will be removed.', '"{name}" हटा दिया जाएगा।'],
            confirm: ["Delete", "हटाएँ"],
          },
          success: { title: ["Product deleted", "उत्पाद हटाया"], body: ["The product was removed.", "उत्पाद हटा दिया गया।"] },
        },
      },
      localeIndex,
    ),
    create: localize(
      {
        loading: ["Loading…", "लोड हो रहा है…"],
        sections: {
          basic: ["Basic information", "मूल जानकारी"],
          content: ["Product content", "उत्पाद सामग्री"],
          specifications: ["Specifications", "विनिर्देश"],
          variants: ["Variants", "वेरिएंट"],
          industriesApplications: ["Industries & applications", "उद्योग और अनुप्रयोग"],
          media: ["Media", "मीडिया"],
          relationships: ["Relationships", "संबंध"],
          seo: ["SEO", "SEO"],
        },
        fields: {
          name: ["Product name", "उत्पाद नाम"],
          productCode: ["Product code", "उत्पाद कोड"],
          slug: ["Slug", "स्लग"],
          category: ["Category", "श्रेणी"],
          type: ["Product type", "उत्पाद प्रकार"],
          status: ["Status", "स्थिति"],
          featured: ["Featured", "विशेष"],
          sortOrder: ["Sort order", "क्रम"],
          shortDescription: ["Short description", "संक्षिप्त विवरण"],
          description: ["Description", "विवरण"],
          features: ["Features", "विशेषताएँ"],
          sku: ["SKU", "SKU"],
          partNumber: ["Part number", "पार्ट नंबर"],
          size: ["Size", "आकार"],
          material: ["Material", "सामग्री"],
          grade: ["Grade", "ग्रेड"],
          standard: ["Standard", "मानक"],
          finish: ["Finish", "फिनिश"],
          thread: ["Thread", "थ्रेड"],
          packaging: ["Packaging", "पैकेजिंग"],
          industries: ["Industries", "उद्योग"],
          applications: ["Applications", "अनुप्रयोग"],
          thumbnail: ["Thumbnail", "थंबनेल"],
          relatedProducts: ["Related products", "संबंधित उत्पाद"],
          compatibleProducts: ["Compatible products", "संगत उत्पाद"],
          accessories: ["Accessories", "एक्सेसरीज़"],
          metaTitle: ["Meta title", "मेटा शीर्षक"],
          metaDescription: ["Meta description", "मेटा विवरण"],
          keywords: ["Keywords", "कीवर्ड"],
          canonical: ["Canonical URL", "कैननिकल URL"],
        },
        specFields: {
          headType: ["Head type", "हेड प्रकार"],
          driveType: ["Drive type", "ड्राइव प्रकार"],
          diameter: ["Diameter", "व्यास"],
          length: ["Length", "लंबाई"],
          threadPitch: ["Thread pitch", "थ्रेड पिच"],
          innerDiameter: ["Inner diameter", "आंतरिक व्यास"],
          outerDiameter: ["Outer diameter", "बाहरी व्यास"],
          thickness: ["Thickness", "मोटाई"],
          height: ["Height", "ऊँचाई"],
          widthAcrossFlats: ["Width across flats", "फ्लैट्स पर चौड़ाई"],
          thread: ["Thread", "थ्रेड"],
        },
        placeholders: { listLines: ["One item per line", "प्रति पंक्ति एक"], select: ["Select…", "चुनें…"] },
        status: { active: ["Active", "सक्रिय"], draft: ["Draft", "ड्राफ्ट"], archived: ["Archived", "संग्रहीत"] },
        image: {
          drop: ["Drop image here", "छवि यहाँ छोड़ें"],
          browse: ["Browse", "ब्राउज़"],
          change: ["Change image", "छवि बदलें"],
          remove: ["Remove", "हटाएँ"],
          hint: ["JPG or PNG, up to 2 MB", "JPG या PNG, अधिकतम 2 MB"],
        },
        actions: { addVariant: ["Add variant", "वेरिएंट जोड़ें"], removeVariant: ["Remove variant", "वेरिएंट हटाएँ"] },
        save: ["Save", "सहेजें"],
        saving: ["Saving…", "सहेजा जा रहा है…"],
        cancelAction: ["Cancel", "रद्द करें"],
        success: { title: ["Product saved", "उत्पाद सहेजा"], body: ["Changes were saved.", "परिवर्तन सहेजे गए।"] },
        errors: {
          title: ["Could not save", "सहेज नहीं सका"],
          generic: ["Try again.", "पुनः प्रयास करें।"],
          validation: ["Fix highlighted fields.", "चिह्नित फ़ील्ड ठीक करें।"],
          required: ["Required.", "आवश्यक।"],
          invalidSlug: ["Invalid slug.", "अमान्य स्लग।"],
        },
        notFound: { title: ["Not found", "नहीं मिला"], body: ["Product may have been removed.", "उत्पाद हटाया गया हो सकता है।"] },
      },
      localeIndex,
    ),
    edit: {},
    view: localize(
      {
        cancelAction: ["Cancel", "रद्द करें"],
        editAction: ["Edit product", "उत्पाद संपादित करें"],
        noImage: ["No image", "कोई छवि नहीं"],
        options: { yes: ["Yes", "हाँ"], no: ["No", "नहीं"] },
        fields: {
          productCode: ["Product code", "उत्पाद कोड"],
          slug: ["Slug", "स्लग"],
          category: ["Category", "श्रेणी"],
          type: ["Type", "प्रकार"],
          status: ["Status", "स्थिति"],
          featured: ["Featured", "विशेष"],
          variants: ["Variants", "वेरिएंट"],
          description: ["Description", "विवरण"],
          created: ["Created", "बनाया"],
          updated: ["Updated", "अपडेट"],
        },
        notFound: { title: ["Not found", "नहीं मिला"], body: ["Product may have been removed.", "उत्पाद हटाया गया हो सकता है।"] },
      },
      localeIndex,
    ),
  };

  admin.products.catalog.edit = JSON.parse(JSON.stringify(admin.products.catalog.create));
  admin.products.catalog.edit.save = localeIndex === 0 ? "Update" : "अपडेट";
  admin.products.catalog.edit.saving = localeIndex === 0 ? "Updating…" : "अपडेट हो रहा है…";

  admin.products.masters.types = {
    create: {
      ...localize(mastersCommon.create, localeIndex),
      configuration: {
        specificationsTitle: localeIndex === 0 ? "Specification fields" : "विनिर्देश फ़ील्ड",
        variantTitle: localeIndex === 0 ? "Variant attributes" : "वेरिएंट विशेषताएँ",
        allowedTitle: localeIndex === 0 ? "Allowed master data" : "अनुमत मास्टर डेटा",
        specFields: admin.products.catalog.create.specFields,
        variantFields: {
          size: localeIndex === 0 ? "Size" : "आकार",
          material: localeIndex === 0 ? "Material" : "सामग्री",
          grade: localeIndex === 0 ? "Grade" : "ग्रेड",
          standard: localeIndex === 0 ? "Standard" : "मानक",
          finish: localeIndex === 0 ? "Finish" : "फिनिश",
          thread: localeIndex === 0 ? "Thread" : "थ्रेड",
          packaging: localeIndex === 0 ? "Packaging" : "पैकेजिंग",
        },
        allowed: {
          allowedSizeIds: localeIndex === 0 ? "Sizes" : "आकार",
          allowedMaterialIds: localeIndex === 0 ? "Materials" : "सामग्री",
          allowedGradeIds: localeIndex === 0 ? "Grades" : "ग्रेड",
          allowedStandardIds: localeIndex === 0 ? "Standards" : "मानक",
          allowedFinishIds: localeIndex === 0 ? "Finishes" : "फिनिश",
          allowedThreadIds: localeIndex === 0 ? "Threads" : "थ्रेड",
          allowedHeadTypeIds: localeIndex === 0 ? "Head types" : "हेड प्रकार",
          allowedDriveTypeIds: localeIndex === 0 ? "Drive types" : "ड्राइव प्रकार",
        },
      },
    },
  };
  admin.products.masters.types.edit = JSON.parse(JSON.stringify(admin.products.masters.types.create));

  fs.writeFileSync(filePath, `${JSON.stringify(admin, null, 2)}\n`);
  console.log(`Patched ${locale}/admin.json`);
}
