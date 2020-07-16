import * as React from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import Draggable, { DraggableCore, DraggableEvent } from 'react-draggable';
import { valueToLuminance } from '../../utils/value-to-luminance';
import { ColorHexEditor } from './color-hex-editor';
import Color from "color";

export interface HSLColor {
  hue: number;
  saturation: number;
  luminance: number;
}

export interface ColorPickerProps {
  onUpdate?: (color: HSLColor) => any;
  onChange?: (color: HSLColor) => any;
}

@observer
export class ColorPicker extends React.Component<ColorPickerProps> {
  @observable private sliderHandleRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
  @observable private sliderTrackRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();
  @observable private paletteRef: React.RefObject<HTMLDivElement> = React.createRef<HTMLDivElement>();

  @observable private sliderLeftPos: string = '0%';
  @observable private hue: number = 0;

  @observable private saturation: number = 1;

  @observable private luminance: number = 50;

  @action private calculateHandlePosition(event: DraggableEvent): void {
    if (!this.sliderTrackRef.current || !this.sliderHandleRef.current || !(event instanceof MouseEvent)) return;

    const parentPos = this.sliderTrackRef.current.getBoundingClientRect();
    const handleWidth = this.sliderHandleRef.current.getBoundingClientRect().width;
    const relativePos = event.x - parentPos.left;

    if (relativePos <= 0) {
      this.hue = 0;
      this.sliderLeftPos = "0%";
    } else if (relativePos >= parentPos.width - handleWidth) {
      this.hue = 360;
      this.sliderLeftPos = `calc(100% - ${handleWidth})`;
    } else {
      const relativePosPercentage = ((relativePos) / parentPos.width) * 100;
      this.hue = (relativePos / parentPos.width) * 360;
      this.sliderLeftPos = `${relativePosPercentage}%`;
    }
    
    this.props.onChange && this.props.onChange({ hue: this.hue, luminance: this.luminance, saturation: this.saturation });
  }

  @action private handleSaturationChange(event: DraggableEvent): void {
    if (!this.paletteRef.current || !(event instanceof MouseEvent)) return;

    const palettePos = this.paletteRef.current.getBoundingClientRect();
    const relativePosX = event.x - palettePos.left;

    if (relativePosX <= palettePos.left) {
      this.saturation = 0;
    } else if (relativePosX >= palettePos.width) {
      this.saturation = 1;
    } else {
      this.saturation = relativePosX / palettePos.width;
    }

    this.props.onChange && this.props.onChange({ hue: this.hue, luminance: this.luminance, saturation: this.saturation });
  }

  @action private handleLuminanceChange(event: DraggableEvent): void {
    if (!this.paletteRef.current || !(event instanceof MouseEvent)) return;
    const palettePos = this.paletteRef.current.getBoundingClientRect();

    const relativePosY = event.y - palettePos.top;
    if (relativePosY <= palettePos.top) {
      this.luminance = valueToLuminance(100, this.saturation);
      return;
    } else if (relativePosY >= palettePos.height) {
      this.luminance = valueToLuminance(0, this.saturation);
    } else {
      const value = 100 - (relativePosY / palettePos.height) * 100;
      this.luminance = valueToLuminance(value, this.saturation);
    }

    this.props.onChange && this.props.onChange({ hue: this.hue, luminance: this.luminance, saturation: this.saturation });
  }

  @action private onSliderTrackClick(ev: React.MouseEvent<HTMLDivElement>): void {
    if (!this.sliderTrackRef.current || !this.sliderHandleRef.current) return;
    ev.persist();
    
    const trackPos = this.sliderTrackRef.current.getBoundingClientRect();
    const handlePos = this.sliderHandleRef.current.getBoundingClientRect();

    const relativePos = ev.clientX - trackPos.left - (handlePos.width / 2);

    this.hue = (relativePos / trackPos.width) * 360;
    this.sliderLeftPos = `${(relativePos / trackPos.width) * 100}%`;

    this.props.onUpdate && this.props.onUpdate({ hue: this.hue, luminance: this.luminance, saturation: this.saturation });
    this.props.onChange && this.props.onChange({ hue: this.hue, luminance: this.luminance, saturation: this.saturation });
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
            onDrag={ev => {
              this.handleSaturationChange(ev);
              this.handleLuminanceChange(ev);
            }}
            onStop={() => this.props.onUpdate && this.props.onUpdate({ hue: this.hue, luminance: this.luminance, saturation: this.saturation })}
          >
            <div className="saturation-handle" />
          </Draggable>
        </section>
        <section className="slider-component">
          <label className="slider-label">
            Color
          </label>
          <section className="slider-container">
            <div className="slider main-color" ref={this.sliderTrackRef} onMouseDown={ev => this.onSliderTrackClick(ev)}>
              <DraggableCore
                onDrag={ev => this.calculateHandlePosition(ev)}
                onStop={() => this.props.onUpdate && this.props.onUpdate({ hue: this.hue, luminance: this.luminance, saturation: this.saturation })}
              >
                <div className="slider-handle" ref={this.sliderHandleRef} style={{ left: this.sliderLeftPos, backgroundColor: `hsl(${this.hue}, 100%, 50%)` }} />
              </DraggableCore>
            </div>
          </section>
        </section>
        <section className="selected-info-container">
          <section className="label">
            Selected
          </section>
          <section className="hsl">
            <ColorHexEditor value={Color(`hsl(${this.hue}, ${this.saturation * 100}%, ${this.luminance}%)`).hex()} />
            <section className="info">
              Hue: {this.hue.toFixed(1)}
            </section>
            <section className="info">
              Saturation: {(this.saturation * 100).toFixed(1)}%
            </section>
            <section className="info">
              Luminance: {this.luminance.toFixed(1)}%
            </section>
          </section>
        </section>
      </section>
    )
  }
}