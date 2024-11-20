export const COUPON_CODES = {
    WELCOME: "WELCOME",
    XMAS2024: "XMAS2024",
    NEWYEAR2025: "NEWYEAR2025"
} as const;

export type CouponCode = keyof typeof COUPON_CODES;