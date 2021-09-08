import { OnChanges, AfterViewInit, Directive, ElementRef } from '@angular/core';
import { React, ReactDOM } from '../';
import { Router } from '@angular/router';
import { LinkProps } from '../Components/LinkWrapper';

@Directive()
export abstract class ReactWrapper<P> implements OnChanges, AfterViewInit {
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

  constructor(protected router: Router, protected elemRef: ElementRef) {}

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
