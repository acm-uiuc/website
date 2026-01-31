interface ApiVariant {
  variantId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  memberLists?: string[];
  inventoryCount?: number | null;
  exchangesAllowed: boolean;
  memberPriceCents: number;
  nonmemberPriceCents: number;
}

interface ApiProduct {
  productId: string;
  name: string;
  description?: string;
  imageUrl?: string;
  openAt?: number;
  closeAt?: number;
  limitConfiguration?: {
    limitType: "PER_PRODUCT" | "PER_VARIANT";
    maxQuantity: number;
  };
  verifiedIdentityRequired: boolean;
  inventoryMode: "PER_PRODUCT" | "PER_VARIANT";
  totalInventoryCount?: number | null;
  variants: ApiVariant[];
}

interface ApiResponse {
  products: ApiProduct[];
}

interface LegacyItem {
  member_price: string;
  nonmember_price: string;
  item_image: string;
  sizes: string[];
  item_price: { paid: number; others: number };
  eventDetails: string;
  item_id: string;
  total_sold: Record<string, number>;
  total_avail: Record<string, number>;
  limit_per_person: number;
  item_sales_active_utc: number;
  item_name: string;
}

function formatPriceRange(prices: number[]): string {
  if (prices.length === 0) return "";

  const uniquePrices = Array.from(new Set(prices)).sort((a, b) => a - b);
  const formatPrice = (cents: number) => `$${(cents / 100).toFixed(2)}`;

  if (uniquePrices.length === 1) {
    return formatPrice(uniquePrices[0] / 100);
  }

  return `${formatPrice(uniquePrices[0] / 100)} - ${formatPrice(uniquePrices[uniquePrices.length - 1] / 100)}`;
}

export function transformApiResponse(apiResponse: ApiResponse): LegacyItem[] {
  return apiResponse.products.map((product) => {
    const memberPrices = product.variants.map((v) => v.memberPriceCents);
    const nonmemberPrices = product.variants.map((v) => v.nonmemberPriceCents);

    // For item_price, use the minimum prices (or you could use average, etc.)
    const minMemberPrice = Math.min(...memberPrices);
    const minNonmemberPrice = Math.min(...nonmemberPrices);

    // Build total_avail from variant inventory
    const total_avail: Record<string, number> = {};
    if (product.inventoryMode === "PER_VARIANT") {
      product.variants.forEach((variant) => {
        if (variant.inventoryCount != null) {
          total_avail[variant.variantId] = variant.inventoryCount;
        }
      });
    } else if (product.totalInventoryCount != null) {
      // For PER_PRODUCT mode, could assign total to a generic key or distribute
      total_avail["total"] = product.totalInventoryCount;
    }

    return {
      item_id: product.productId,
      item_name: product.name,
      item_image: product.imageUrl ?? "",
      description: product.description,
      member_price: formatPriceRange(memberPrices),
      nonmember_price: formatPriceRange(nonmemberPrices),
      item_price: {
        paid: minMemberPrice / 100,
        others: minNonmemberPrice / 100,
      },
      sizes: product.variants.map((v) => v.name),
      variants: product.variants.map(v => ({
        id: v.variantId,
        name: v.name,
        memberLists: v.memberLists ?? []
      })),
      eventDetails: product.description ?? "",
      total_sold: {}, // API doesn't provide this; initialize empty
      total_avail,
      limit_per_person: product.limitConfiguration?.maxQuantity ?? -1,
      item_sales_active_utc: product.openAt ?? -1,
    };
  });
}
