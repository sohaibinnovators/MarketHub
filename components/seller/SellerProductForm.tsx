"use client";

import Image from "next/image";
import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input, Select, Textarea } from "@/components/ui/Input";
import { categories } from "@/lib/data";
import { fileToPreviewDataUrl, parseList } from "@/lib/image-preview";
import { useMarketplace } from "@/lib/marketplace";
import { useStore } from "@/lib/store";
import type { ProductInput, SellerListingStatus, SellerProductRecord } from "@/lib/types";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80";

type Props = {
  mode: "create" | "edit";
  initial?: SellerProductRecord;
};

export function SellerProductForm({ mode, initial }: Props) {
  const router = useRouter();
  const { addProduct, updateProduct } = useMarketplace();
  const { notify } = useStore();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState(initial?.image ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.image ?? "");
  const [submitting, setSubmitting] = useState(false);

  const initialColors = useMemo(
    () => initial?.colors?.join(", ") ?? "",
    [initial],
  );
  const initialSizes = useMemo(
    () =>
      initial?.variants?.find((variant) => variant.name === "Size")?.options.join(
        ", ",
      ) ?? "",
    [initial],
  );

  const onFileChange = async (file?: File | null) => {
    if (!file) return;
    const result = await fileToPreviewDataUrl(file);
    if (!result.ok) {
      setErrors((prev) => ({ ...prev, image: result.message }));
      return;
    }
    setImagePreview(result.url);
    setImageUrl(result.url);
    setErrors((prev) => {
      const next = { ...prev };
      delete next.image;
      return next;
    });
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (submitting) return;
    const form = new FormData(event.currentTarget);
    const nextErrors: Record<string, string> = {};

    const name = String(form.get("name") ?? "").trim();
    const description = String(form.get("description") ?? "").trim();
    const categorySlug = String(form.get("category") ?? "");
    const brand = String(form.get("brand") ?? "").trim();
    const price = Number(form.get("price"));
    const originalRaw = String(form.get("originalPrice") ?? "").trim();
    const originalPrice = originalRaw ? Number(originalRaw) : undefined;
    const stock = Number(form.get("stock"));
    const listingStatus = String(
      form.get("listingStatus") ?? "Active",
    ) as SellerListingStatus;
    const colors = parseList(String(form.get("colors") ?? ""));
    const sizes = parseList(String(form.get("sizes") ?? ""));
    const isFeatured = form.get("isFeatured") === "on";
    const image = (imageUrl || String(form.get("imageUrl") ?? "")).trim();

    if (name.length < 3) nextErrors.name = "Enter a product name.";
    if (description.length < 20)
      nextErrors.description = "Add at least 20 characters.";
    if (!categorySlug) nextErrors.category = "Select a category.";
    if (brand.length < 2) nextErrors.brand = "Enter a brand.";
    if (!Number.isFinite(price) || price <= 0)
      nextErrors.price = "Enter a valid price.";
    if (
      originalPrice !== undefined &&
      (!Number.isFinite(originalPrice) || originalPrice <= price)
    ) {
      nextErrors.originalPrice = "Original price must be greater than price.";
    }
    if (!Number.isFinite(stock) || stock < 0)
      nextErrors.stock = "Enter a valid stock count.";
    if (!image) nextErrors.image = "Add an image URL or upload a preview.";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const input: ProductInput = {
      name,
      description,
      longDescription: description,
      categorySlug,
      brand,
      price,
      originalPrice,
      stock: listingStatus === "Out of Stock" ? 0 : stock,
      image: image || FALLBACK_IMAGE,
      images: [image || FALLBACK_IMAGE],
      colors,
      sizes,
      listingStatus,
      isFeatured,
      features: ["Seller-managed MarketHub listing"],
    };

    setSubmitting(true);
    const result =
      mode === "edit" && initial
        ? updateProduct(initial.id, input)
        : addProduct(input);

    if (!result.ok) {
      setSubmitting(false);
      notify({ title: result.message, tone: "error" });
      return;
    }

    notify({
      title: mode === "edit" ? "Product updated" : "Product added",
      description: result.product?.name,
      tone: "success",
    });
    router.push("/seller-dashboard/products");
  };

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="rounded-2xl border border-border bg-surface p-6 shadow-sm"
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          id="name"
          name="name"
          label="Product name"
          defaultValue={initial?.name}
          error={errors.name}
          className="md:col-span-2"
        />
        <Textarea
          id="description"
          name="description"
          label="Product description"
          defaultValue={initial?.description}
          error={errors.description}
          className="md:col-span-2"
        />
        <Select
          id="category"
          name="category"
          label="Category"
          defaultValue={initial?.categorySlug ?? ""}
          error={errors.category}
        >
          <option value="" disabled>
            Select category
          </option>
          {categories.map((category) => (
            <option key={category.id} value={category.slug}>
              {category.name}
            </option>
          ))}
        </Select>
        <Input
          id="brand"
          name="brand"
          label="Brand"
          defaultValue={initial?.brand ?? "NovaTech"}
          error={errors.brand}
        />
        <Input
          id="price"
          name="price"
          type="number"
          step="0.01"
          min="0"
          label="Price (USD)"
          defaultValue={initial?.price}
          error={errors.price}
        />
        <Input
          id="originalPrice"
          name="originalPrice"
          type="number"
          step="0.01"
          min="0"
          label="Original price (optional)"
          defaultValue={initial?.originalPrice ?? ""}
          error={errors.originalPrice}
        />
        <Input
          id="stock"
          name="stock"
          type="number"
          min="0"
          label="Available stock"
          defaultValue={initial?.stock ?? 10}
          error={errors.stock}
        />
        <Select
          id="listingStatus"
          name="listingStatus"
          label="Product status"
          defaultValue={initial?.listingStatus ?? "Active"}
        >
          <option value="Active">Active</option>
          <option value="Draft">Draft</option>
          <option value="Out of Stock">Out of Stock</option>
        </Select>
        <Input
          id="colors"
          name="colors"
          label="Colors (comma separated)"
          defaultValue={initialColors}
          placeholder="Black, White"
        />
        <Input
          id="sizes"
          name="sizes"
          label="Sizes (comma separated)"
          defaultValue={initialSizes}
          placeholder="S, M, L"
        />
        <Input
          id="imageUrl"
          name="imageUrl"
          label="Image URL"
          value={imageUrl}
          onChange={(event) => {
            setImageUrl(event.target.value);
            setImagePreview(event.target.value);
          }}
          error={errors.image}
          hint="Or upload a temporary browser preview below. Images are not uploaded to a server."
          className="md:col-span-2"
        />
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-text">
            Upload image preview
          </label>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            className="mt-2 block w-full text-sm text-muted file:mr-3 file:rounded-lg file:border-0 file:bg-primary/10 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-primary"
            onChange={(event) => onFileChange(event.target.files?.[0])}
          />
        </div>
        {imagePreview ? (
          <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-slate-100 md:col-span-2">
            <Image
              src={imagePreview}
              alt="Product preview"
              fill
              unoptimized={imagePreview.startsWith("data:")}
              className="object-cover"
              sizes="800px"
            />
          </div>
        ) : null}
        <label className="flex items-center gap-2 text-sm text-text md:col-span-2">
          <input
            type="checkbox"
            name="isFeatured"
            defaultChecked={Boolean(initial?.isFeatured)}
            className="rounded border-border text-primary"
          />
          Mark as featured product
        </label>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting
            ? "Saving..."
            : mode === "edit"
              ? "Save changes"
              : "Add product"}
        </Button>
        <Button href="/seller-dashboard/products" variant="outline">
          Cancel
        </Button>
      </div>
    </form>
  );
}
