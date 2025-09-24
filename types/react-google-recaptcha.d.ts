// src/types/react-google-recaptcha.d.ts
declare module "react-google-recaptcha" {
  import * as React from "react";

  export interface ReCAPTCHAProps {
    sitekey: string;
    theme?: "light" | "dark";
    size?: "compact" | "normal" | "invisible";
    tabindex?: number;
    onChange?: (token: string | null) => void;
    onExpired?: () => void;
    onErrored?: () => void;
    hl?: string;
    ref?: React.Ref<any>;
  }

  export default class ReCAPTCHA extends React.Component<ReCAPTCHAProps> {}
}
