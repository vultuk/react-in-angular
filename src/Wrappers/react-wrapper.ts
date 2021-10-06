import { OnChanges, AfterViewInit } from '@angular/core';
import { React, ReactDOM } from '../';
import { LinkProps } from '../Components/LinkWrapper';

export type RouterWrapper = {
  navigateByUrl: (url: string) => Promise<void>;
};

export type ElementRefWrapper = {
  nativeElement: {
    tagName: string;
  };
};

export abstract class ReactWrapper<P> implements OnChanges, AfterViewInit {
  protected abstract router: RouterWrapper;
  protected abstract elemRef: ElementRefWrapper;

  public abstract setProps(): P;

  public abstract setComponent():
    | string
    | React.FunctionComponent<LinkProps<P>>
    | React.ComponentClass<LinkProps<P>, any>;

  /**
   * Set the root ID for the react component based on the element name
   */
  public get rootId() {
    return `${this.elemRef.nativeElement.tagName.toLowerCase()}-root`;
  }

  private hasViewLoaded = false;

  /**
   * If anything has been changed, then re-render the component
   */
  public ngOnChanges() {
    this.renderComponent();
  }

  /**
   * When the angular view has been initialised render the react component
   */
  public ngAfterViewInit() {
    this.hasViewLoaded = true;
    this.renderComponent();
  }

  /**
   * Creates a Navigation function that can be passed through to react
   */
  NavigateTo = (link: string, options?: any) => {
    this.router.navigateByUrl(link);
  };

  /**
   * Render the appropriate react component
   */
  private renderComponent() {
    if (!this.hasViewLoaded) {
      return;
    }

    ReactDOM.render(
      React.createElement(this.setComponent(), {
        ...this.setProps(),
        Navigate: this.NavigateTo,
      }),
      document.getElementById(this.rootId),
    );
  }
}
