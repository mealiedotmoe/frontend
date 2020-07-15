import * as React from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import Draggable, { DraggableCore, DraggableEvent } from 'react-draggable';

export interface ColorPickerProps {}

@observer
export class ColorPicker extends React.Component<ColorPickerProps> {
  @observable private sliderHandleRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
  @observable private sliderTrackRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
  @observable private paletteRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();

  @observable private sliderLeftPos: string = '0%';
  @observable private hue: number = 0;

  @observable private saturation: number = 100;

  @observable private brightness: number = 50;

  public componentDidMount(): void {
  }

  @action private calculateHandlePosition(event: DraggableEvent): void {
    if (!this.sliderTrackRef.current || !this.sliderHandleRef.current || !(event instanceof MouseEvent)) return;
    const parentPos = this.sliderTrackRef.current.getBoundingClientRect();
    const handleWidth = this.sliderHandleRef.current.getBoundingClientRect().width;
    const relativePos = event.x - parentPos.left;
    if (relativePos <= 0) {
      this.hue = 0;
      this.sliderLeftPos = "0%";
      return;
    }
    if (relativePos >= parentPos.width - handleWidth) {
      this.hue = 360;
      this.sliderLeftPos = `calc(100% - ${handleWidth})`;
      return;
    }
    const relativePosPercentage = ((relativePos) / parentPos.width) * 100;
    this.hue = (relativePos / parentPos.width) * 360;
    this.sliderLeftPos = `${relativePosPercentage}%`;
  }

  @action private handleSaturationChange(event: DraggableEvent): void {
    if (!this.paletteRef.current || !(event instanceof MouseEvent)) return;
    const palettePos = this.paletteRef.current.getBoundingClientRect();
    const relativePosX = event.x - palettePos.left;
    if (relativePosX >= palettePos.width) {
      this.saturation = 100;
      return;
    }
    this.saturation = (relativePosX / palettePos.width) * 100;

    const relativePosY = event.y - palettePos.top;
    if (relativePosY <= palettePos.top) {
      const value = 0;
    }
  }

  public render() {
    return (
      <section className="color-picker">
        <section
          style={{ background: `linear-gradient(to top, #000000, transparent), linear-gradient(to left, hsl(${this.hue}, 100%, 50%), #FFFFFF), #FFFFFF` }}
          className="picker-body"
          ref={this.paletteRef}
        >
          <Draggable
            bounds="parent"
            onDrag={ev => this.handleSaturationChange(ev)}
          >
            <div className="saturation-handle" />
          </Draggable>
        </section>
        <section className="slider-component">
          <label className="slider-label">
            Color
          </label>
          <section className="slider-container">
            <div className="slider main-color" ref={this.sliderTrackRef}>
              <DraggableCore
                onDrag={ev => this.calculateHandlePosition(ev)}
              >
                <div className="slider-handle" ref={this.sliderHandleRef} style={{ left: this.sliderLeftPos, backgroundColor: `hsl(${this.hue}, 100%, 50%)` }} />
              </DraggableCore>
            </div>
          </section>
        </section>
      </section>
    )
  }
}