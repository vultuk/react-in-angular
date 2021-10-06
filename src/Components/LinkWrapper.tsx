import React from 'react';

type ExternalLinkWrapperProps = {
  Navigate?: (url: string) => void;
};

export type LinkProps<T = any> = ExternalLinkWrapperProps & T;

type LinkWrapperProps = LinkProps<{
  to: string;
  className?: any;
  children: any;
}>;

/**
 * The link wrapper is built to return a Link component and also
 * a useHistory method which can be used to replicate the react-router-dom
 * workflow of changing pages via links or programatically
 */
const LinkWrapper = (Navigate: (to: string) => void) => ({
  Component: ({ to, className, children }: LinkWrapperProps) => {
    const go = (event: React.MouseEvent) => {
      event.preventDefault();
      Navigate(to);
    };

    return (
      <a href={to} onClick={go} className={className}>
        {children}
      </a>
    );
  },
  useHistory: {
    push: (to: string) => {
      Navigate(to);
    },
  },
});

export default LinkWrapper;
