import * as React from 'react';
import { observer } from 'mobx-react';
import { Hue, EditableInput, Saturation } from 'react-color/lib/components/common';
import { CustomPicker, CustomPickerProps } from "react-color";
import Color from 'color';

const PointerComponent: React.FunctionComponent<Record<string, unknown>> = (): JSX.Element => (
  <div className="slider-handle" />
);

@observer
class ColorPicker extends React.Component<CustomPickerProps<ColorPicker>> {
  public render() {
    return (
      <section className="color-picker">
        <section className="picker-body">
          <Saturation {...this.props} pointer={PointerComponent} />
        </section>
        <section className="slider-component">
          <label className="slider-label">
            Color
          </label>
          <section className="slider-container">
            <Hue {...this.props} pointer={PointerComponent} />
          </section>
        </section>
        <section className="selected-info-container">
          <section className="label">
            Selected
          </section>
          <section className="hsl">
            <EditableInput
              value={this.props.color?.toString()}
              onChange={(color, ev) => this.props.onChange(color, ev)}
              style={{
                input: {
                  border: "none",
                  background: "rgba(0,0,0,.5)",
                  borderRadius: 5,
                  outline: "none",
                  fontFamily: "inherit",
                  fontSize: 14,
                  color: "rgba(255,255,255,.6)",
                  padding: 8,
                  width: 120,
                  textAlign: "center",
                  userSelect: "auto"
                }
              }}
            />
            <section className="info">
              Red: {Color(this.props.color).red()}
            </section>
            <section className="info">
              Green: {Color(this.props.color).green()}
            </section>
            <section className="info">
              Blue: {Color(this.props.color).blue()}
            </section>
          </section>
        </section>
      </section>
    );
  }
}

//@ts-ignore
export default CustomPicker(ColorPicker);
