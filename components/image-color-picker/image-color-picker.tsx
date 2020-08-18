import { action, computed, observable } from 'mobx';
import { observer } from 'mobx-react';
import * as React from 'react';
import Dropzone, { DropzoneState } from 'react-dropzone';
import { MdContentCopy, MdImage } from 'react-icons/md';

import { ImageCanvas, ImageCanvasData } from './image-canvas';

export interface ImageColorPickerProps {
  onChange: (color: string) => any;
}

@observer
export class ImageColorPicker extends React.Component<ImageColorPickerProps> {
  @observable private imageLoaded: boolean = false;
  @observable private canvasData: ImageCanvasData | null = null;
  @observable private currentColor: string = "#000000";
  private inputContainerRef: React.RefObject<HTMLDivElement> = React.createRef();

  @action private async addFiles(files: Array<File>): Promise<void> {
    const firstImage = files[0];
    if (!firstImage) return;

    const imageReader = new FileReader();
    imageReader.onload = (ev) => {
      const image = new Image();
      image.onload = () => {
        const imageDimensions = {
          height: image.naturalHeight,
          width: image.naturalWidth
        };
        if (!this.inputContainerRef.current) return;
        const { height: containerHeight, width: containerWidth } = this.inputContainerRef.current.getBoundingClientRect();

        // See: https://stackoverflow.com/a/14731922/4332216
        const ratio = Math.min(
          containerWidth / imageDimensions.width,
          containerHeight / imageDimensions.height
        );
        this.canvasData = {
          image,
          size: {
            height: imageDimensions.height * ratio,
            width: imageDimensions.width * ratio
          }
        };

        this.imageLoaded = true;
      };

      image.src = ev.target?.result as string;
    };

    imageReader.readAsDataURL(firstImage.slice())
  }

  @action private openNewFile(): void {
    this.canvasData = null;
    this.imageLoaded = false;
    // We use a set timeout here for a small duration here
    // since after the action is propagated it takes a cycle 
    // of render to happen before the input is mounted again.
    setTimeout(() => this.inputContainerRef.current?.click(), 10);
  }
  
  @computed private get renderContent(): React.ReactNode {
    if (this.imageLoaded && this.canvasData) {
      return (
        <>
          <ImageCanvas
            imageData={this.canvasData}
            onHover={color => this.currentColor = color}
            onChange={this.props.onChange}
            className="image-canvas"
          />
          <section className="current-color-display">
            <div style={{ background: this.currentColor }} className="current-color-box" />
            &middot;
            <div className="current-color">
              {this.currentColor}
            </div>
            &middot;
            <button className="button text small" onClick={() => this.openNewFile()}>
              Use a different image
            </button>
          </section>
        </>
      )
    }

    return (
      <Dropzone onDrop={files => this.addFiles(files)} accept="image/*">
        {({ getRootProps, getInputProps }: DropzoneState) => (
          <section {...getRootProps({
            className: "dropzone-container"
          })} ref={this.inputContainerRef}>
            <input {...getInputProps()} />
            <section className="hint-options">
              <section className="hint">
                <MdImage className="image-icon" />
                Upload an image
              </section>
              <span className="middle-text">OR</span>
              <section className="hint">
                <MdContentCopy className="image-icon" />
                Drag n' drop
              </section>
            </section>
          </section>
        )}
      </Dropzone>
    )
  }

  public render() {
    return (
      <section className="image-color-picker-container">
        {this.renderContent}
      </section>
    )
  }
}