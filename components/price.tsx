import { useFormatPrice } from "@/hooks";

import { Typography } from "@msaaqcom/abjad";
import { cn } from "@msaaqcom/abjad/dist/theme";

const Price = ({
  price,
  as = "ins",
  classNames,
  useSymbol = false
}: {
  price: number;
  as?: string;
  useSymbol?: boolean;
  classNames?: {
    price?: string;
    currency?: string;
  };
}) => {
  const { formatPriceWithoutCurrency, currentCurrencyLocalizeSymbol, currentCurrency } = useFormatPrice();

  return (
    <div className="product-price flex flex-shrink-0 items-center gap-1">
      <Typography.Body
        as={as}
        size="base"
        dir="auto"
        className={cn("font-bold no-underline", classNames?.price)}
      >
        {formatPriceWithoutCurrency(price)}
      </Typography.Body>
      <Typography.Body
        as="span"
        size="sm"
        className={cn("font-medium", classNames?.currency)}
      >
        {useSymbol ? currentCurrencyLocalizeSymbol : currentCurrency}
      </Typography.Body>
    </div>
  );
};

export { Price };
