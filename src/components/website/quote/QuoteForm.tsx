"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/buttons";
import { buildQuoteMessage, isQuoteFormValid, validateQuoteForm } from "@/lib/validations/quote";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { messagesActions } from "@/store/modules/messages/slice";
import { selectEnquiryError, selectEnquiryStatus } from "@/store/modules/messages/selectors";
import { Link, useRouter } from "@/i18n/routing";
import { productHref, ROUTES } from "@/lib/constants";
import {
  findSizeOptionByLabel,
  getDefaultSizeOption,
  getProductSizeLabels,
} from "@/lib/product-size-options";
import type { QuoteFormErrors } from "@/lib/validations/quote";
import type { ProductSizeOption } from "@/types/product";

export type QuoteProductOption = {
  id: string;
  slug: string;
  name: string;
  image: string;
  category: string;
  categorySlug: string;
  subcategory: string;
  subcategorySlug: string;
  sizeOptions: ProductSizeOption[];
  keySpec: string;
  shortDescription: string;
  description: string;
  features: string[];
  applications: string[];
  specifications: Array<{ label: string; value: string }>;
};

type QuoteFormProps = {
  products?: QuoteProductOption[];
  defaultProductId?: string;
};

const CUSTOM_SLUG = "custom";

export function QuoteForm({ products, defaultProductId }: QuoteFormProps) {
  const t = useTranslations("quote");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const status = useAppSelector(selectEnquiryStatus);
  const error = useAppSelector(selectEnquiryError);
  const defaultProduct = products?.find((item) => item.id === defaultProductId || item.slug === defaultProductId);
  const [categorySlug, setCategorySlug] = useState(defaultProduct?.categorySlug ?? "");
  const [subcategorySlug, setSubcategorySlug] = useState(defaultProduct?.subcategorySlug ?? "");
  const [productSlug, setProductSlug] = useState(defaultProduct?.id ?? defaultProductId ?? "");
  const [size, setSize] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [quantity, setQuantity] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<QuoteFormErrors>({});
  const [canRedirect, setCanRedirect] = useState(false);

  const categories = useMemo(() => {
    const map = new Map<string, string>();
    products?.forEach((item) => {
      if (item.categorySlug) {
        map.set(item.categorySlug, item.category);
      }
    });
    return Array.from(map, ([slug, name]) => ({ slug, name }));
  }, [products]);

  const subcategories = useMemo(() => {
    const map = new Map<string, string>();
    products
      ?.filter((item) => !categorySlug || item.categorySlug === categorySlug)
      .forEach((item) => {
        if (item.subcategorySlug) {
          map.set(item.subcategorySlug, item.subcategory);
        }
      });
    return Array.from(map, ([slug, name]) => ({ slug, name }));
  }, [products, categorySlug]);

  const filteredProducts = useMemo(
    () =>
      products?.filter((item) => {
        const categoryMatch = !categorySlug || item.categorySlug === categorySlug;
        const subcategoryMatch = !subcategorySlug || item.subcategorySlug === subcategorySlug;
        return categoryMatch && subcategoryMatch;
      }) ?? [],
    [products, categorySlug, subcategorySlug],
  );

  const selected = useMemo(
    () => products?.find((item) => item.id === productSlug || item.slug === productSlug),
    [products, productSlug],
  );
  const isCustom = productSlug === CUSTOM_SLUG;
  const sizes = selected ? getProductSizeLabels(selected) : [];
  const selectedSizeOption = findSizeOptionByLabel(selected ?? { sizeOptions: [] }, size);
  const previewImage = selectedSizeOption?.image || selected?.image || "";

  useEffect(() => {
    if (!defaultProduct) {
      return;
    }
    setCategorySlug(defaultProduct.categorySlug ?? "");
    setSubcategorySlug(defaultProduct.subcategorySlug ?? "");
    setProductSlug(defaultProduct.id ?? "");
  }, [defaultProduct]);

  useEffect(() => {
    dispatch(messagesActions.resetEnquiry());
  }, [dispatch]);

  useEffect(() => {
    if (status === "idle") {
      setCanRedirect(true);
    }
  }, [status]);

  useEffect(() => {
    if (canRedirect && status === "succeeded") {
      router.push(ROUTES.quoteSuccess);
    }
  }, [canRedirect, router, status]);

  useEffect(() => {
    if (!categorySlug || subcategorySlug) {
      return;
    }
    if (subcategories.length === 1) {
      setSubcategorySlug(subcategories[0]?.slug ?? "");
    }
  }, [categorySlug, subcategorySlug, subcategories]);

  useEffect(() => {
    if (!selected || isCustom) {
      return;
    }
    const labels = getProductSizeLabels(selected);
    if (labels.length === 1) {
      setSize(labels[0] ?? "");
      return;
    }

    const defaultSize = getDefaultSizeOption(selected);
    if (defaultSize?.label) {
      setSize(defaultSize.label);
    }
  }, [selected, isCustom]);

  function onCategoryChange(value: string) {
    setCategorySlug(value);
    setSubcategorySlug("");
    setProductSlug("");
    setSize("");
  }

  function onSubcategoryChange(value: string) {
    setSubcategorySlug(value);
    setProductSlug("");
    setSize("");
  }

  function onProductChange(value: string) {
    setProductSlug(value);
    setSize("");
    const next = products?.find((item) => item.id === value || item.slug === value);
    if (next?.categorySlug) {
      setCategorySlug(next.categorySlug);
    }
    if (next?.subcategorySlug) {
      setSubcategorySlug(next.subcategorySlug);
    }
  }

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validateQuoteForm({
      name,
      email,
      phone,
      productSlug,
      size,
      quantity,
      message: note,
      isCustom,
      requiresSize: Boolean(!isCustom && sizes.length),
    });
    setErrors(nextErrors);
    if (!isQuoteFormValid(nextErrors)) {
      return;
    }

    dispatch(
      messagesActions.submitEnquiryRequested({
        name,
        email,
        phone,
        company,
        productSlug,
        productId: selected?.id ?? (isCustom ? undefined : productSlug),
        size,
        quantity,
        message: buildQuoteMessage({
          productName: selected?.name,
          productSlug,
          keySpec: selected?.keySpec,
          size,
          specs: selected?.specifications,
          quantity,
          note,
        }),
      }),
    );
  }

  return (
    <div className={"quote-stage"}>
      <form className={"quote-ticket"} onSubmit={onSubmit} noValidate>
        <p className="t-caption">{t("ticketEyebrow")}</p>
        <h2 className="t-h3">{t("ticketTitle")}</h2>
        <p className={cn("t-muted", "mt-3")}>{t("ticketLede")}</p>

        <div className={"quote-ticket__grid"}>
          <label>
            {t("form.category")}
            <select value={categorySlug} onChange={(event) => onCategoryChange(event.target.value)}>
              <option value="">{t("form.categoryPlaceholder")}</option>
              {categories.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label>
            {t("form.subcategory")}
            <select
              value={subcategorySlug}
              onChange={(event) => onSubcategoryChange(event.target.value)}
              disabled={!categorySlug}
            >
              <option value="">{categorySlug ? t("form.subcategoryPlaceholder") : t("form.subcategoryDisabled")}</option>
              {subcategories.map((item) => (
                <option key={item.slug} value={item.slug}>
                  {item.name}
                </option>
              ))}
            </select>
          </label>
          <label className={"quote-ticket__full"}>
            {t("form.product")}
            <select value={productSlug} onChange={(event) => onProductChange(event.target.value)}>
              <option value="">
                {categorySlug ? t("form.productPlaceholder") : t("form.productDisabled")}
              </option>
              {(categorySlug ? filteredProducts : []).map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
              <option value={CUSTOM_SLUG}>{t("form.productCustom")}</option>
            </select>
            {errors.productSlug ? <span className="form__error">{t(errors.productSlug)}</span> : null}
          </label>
          <label>
            {t("form.size")}
            <select
              value={size}
              onChange={(event) => setSize(event.target.value)}
              disabled={!selected || isCustom || !sizes.length}
            >
              <option value="">{selected && !isCustom ? t("form.sizePlaceholder") : t("form.sizeDisabled")}</option>
              {sizes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
            {errors.size ? <span className="form__error">{t(errors.size)}</span> : null}
          </label>
          <label>
            {t("form.quantity")}
            <input
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              placeholder={t("form.quantityPlaceholder")}
              inputMode="numeric"
            />
            {errors.quantity ? <span className="form__error">{t(errors.quantity)}</span> : null}
          </label>
          <label>
            {t("form.name")}
            <input value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" />
            {errors.name ? <span className="form__error">{t(errors.name)}</span> : null}
          </label>
          <label>
            {t("form.email")}
            <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" />
            {errors.email ? <span className="form__error">{t(errors.email)}</span> : null}
          </label>
          <label>
            {t("form.phone")}
            <input type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} autoComplete="tel" />
          </label>
          <label>
            {t("form.company")}
            <input value={company} onChange={(event) => setCompany(event.target.value)} autoComplete="organization" />
          </label>
          <label className={"quote-ticket__full"}>
            {isCustom ? t("form.noteCustom") : t("form.note")}
            <textarea
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder={isCustom ? undefined : t("form.notePlaceholder")}
            />
            {errors.message ? <span className="form__error">{t(errors.message)}</span> : null}
          </label>
        </div>

        {status === "failed" ? <p className="form__error">{error ?? t("form.error")}</p> : null}

        <Button type="submit" variant="accent" disabled={status === "loading"}>
          {status === "loading" ? t("form.sending") : t("form.submit")}
        </Button>
      </form>

      <aside className={selected || isCustom ? "quote-preview" : "quote-preview is-blank"} aria-hidden={!selected && !isCustom}>
        {isCustom ? (
          <div className={"quote-preview__card"}>
            <div className={"quote-preview__meta"}>
              <p className="t-caption">{t("selected")}</p>
              <h2 className={"quote-preview__name"}>{t("customTitle")}</h2>
              <p className={"quote-preview__lede"}>{t("customBody")}</p>
            </div>
          </div>
        ) : selected ? (
          <div className={"quote-preview__card"}>
            {previewImage ? (
              <Link href={productHref(selected.id)} className={"quote-preview__media"}>
                <Image src={previewImage} alt={selected.name} width={360} height={270} sizes="340px" quality={75} />
              </Link>
            ) : null}
            <div className={"quote-preview__meta"}>
              <p className="t-caption">
                {[selected.category, selected.subcategory].filter(Boolean).join(" / ")}
              </p>
              <h2 className={"quote-preview__name"}>
                <Link href={productHref(selected.id)}>{selected.name}</Link>
              </h2>
              {selected.keySpec ? <p className={"quote-preview__spec"}>{selected.keySpec}</p> : null}
              {selected.shortDescription ? <p className={"quote-preview__lede"}>{selected.shortDescription}</p> : null}
              {size || selected.specifications?.length ? (
                <dl className={"quote-specs"}>
                  {size ? (
                    <div className={"quote-specs__row"}>
                      <dt>{t("preview.size")}</dt>
                      <dd>{size}</dd>
                    </div>
                  ) : null}
                  {selected.specifications?.slice(0, 5).map((item) => (
                    <div key={item.label} className={"quote-specs__row"}>
                      <dt>{item.label}</dt>
                      <dd>{item.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : null}
            </div>
          </div>
        ) : null}
      </aside>
    </div>
  );
}
