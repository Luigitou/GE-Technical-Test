export interface IMatrix {
    multiply(matrix: IMatrix): IMatrix;

    inverse(): IMatrix;

    applyTransformationToPoint(point: IPoint): IPoint;
    
}

export interface IPoint {
    x: number;
    y: number;
}