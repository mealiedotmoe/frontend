import * as React from 'react';
import { observable } from 'mobx';
import { observer } from 'mobx-react';
import { findCanvasMousePos } from '../../utils/find-canvas-mouse-pos';
import { rgbToHex } from '../../utils/rgb-to-hex';

export interface ImageCanvasProps {
  imageData: ImageCanvasData;
  onHover?: (color: string) => any;
  onChange?: (color: string) => any;
  className?: string;
};

export interface ImageCanvasData {
  image: HTMLImageElement;
  size: {
    height: number;
    width: number;
  }
}

@observer
export class ImageCanvas extends React.Component<ImageCanvasProps> {
  @observable private canvasRef: React.RefObject<HTMLCanvasElement> = React.createRef();

  private drawCanvas(): void {
    if (!this.canvasRef.current) return;
    this.canvasRef.current.addEventListener('mousemove', (event) => this.handleMouseMove(event));
    this.canvasRef.current.getContext('2d')?.drawImage(
      this.props.imageData.image,
      0,
      0,
      this.props.imageData.size.width,
      this.props.imageData.size.height
    );
  }

  public componentDidMount(): void {
    // TODO: Zoom and pan
    this.drawCanvas();
  }

  private getCanvasPointColor(x: number, y: number): string {
    if (!this.canvasRef.current) return '#000000';
    const context = this.canvasRef.current.getContext('2d');
    if (!context) return '#000000';

    const pointData = context.getImageData(x, y, 1, 2).data;

    return '#' + ("000000" + rgbToHex(pointData[0], pointData[1], pointData[2])).slice(-6);
  }

  private handleMouseMove(event: MouseEvent): void {
    if (!this.canvasRef.current) return;

    const mousePos = findCanvasMousePos(event, this.canvasRef.current);
    const color = this.getCanvasPointColor(mousePos.x, mousePos.y);

    if(this.props.onHover) this.props.onHover(color);
  }

  private selectColor(event: React.MouseEvent<HTMLCanvasElement>): void {
    event.persist();
    if (!this.canvasRef.current) return;

    const mousePos = findCanvasMousePos(event, this.canvasRef.current);
    const color = this.getCanvasPointColor(mousePos.x, mousePos.y);

    if(this.props.onChange) this.props.onChange(color);
  }

  public render() {
    return (
      <section className={this.props.className}>
        <canvas
          onClick={(event) => this.selectColor(event)}
          height={this.props.imageData.size.height}
          width={this.props.imageData.size.width}
          ref={this.canvasRef}
        />
      </section>
    )
  }
}