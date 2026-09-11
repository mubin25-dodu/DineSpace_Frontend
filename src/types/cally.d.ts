import "react";

declare module "react" {
    namespace JSX {
        interface IntrinsicElements {
            "calendar-date": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
                onclick?: (event: React.MouseEvent<HTMLElement>) => void;
            };
            "calendar-month": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
        }
    }
}
