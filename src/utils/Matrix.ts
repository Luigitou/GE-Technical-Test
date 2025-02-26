import {IMatrix, IPoint} from "../interfaces/IMatrix";

export class Matrix implements IMatrix {
    matrix: number[][];

    constructor(matrix: number[][]) {
        this.matrix = matrix;
    }

    public static identity(): IMatrix {
        return new Matrix([
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ])
    }

    public static translationMatrix(x: number, y: number): IMatrix {
        return new Matrix([
            [1, 0, x],
            [0, 1, y],
            [0, 0, 1]
        ])
    }

    public static rotationMatrix(angle: number): IMatrix {
        return new Matrix([
            [Math.cos(angle), -Math.sin(angle), 0],
            [Math.sin(angle), Math.cos(angle), 0],
            [0, 0, 1]
        ])
    }

    public static scaleMatrix(x: number, y: number): IMatrix {
        return new Matrix([
            [x, 0, 0],
            [0, y, 0],
            [0, 0, 1]
        ])
    }

    inverse(): IMatrix {
        const m = this.matrix;
        const a = m[0][0], b = m[0][1], c = m[0][2];
        const d = m[1][0], e = m[1][1], f = m[1][2];
        const g = m[2][0], h = m[2][1], i = m[2][2];

        const det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
        if (det === 0) {
            throw new Error("Matrix is not invertible");
        }
        const invDet = 1 / det;

        const inverseMatrix = [
            [(e * i - f * h) * invDet, -(b * i - c * h) * invDet, (b * f - c * e) * invDet],
            [-(d * i - f * g) * invDet, (a * i - c * g) * invDet, -(a * f - c * d) * invDet],
            [(d * h - e * g) * invDet, -(a * h - b * g) * invDet, (a * e - b * d) * invDet]
        ];
        return new Matrix(inverseMatrix);
    }

    multiply(matrix: IMatrix): IMatrix {
        const other = matrix as Matrix;
        const result: number[][] = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let sum = 0;
                for (let k = 0; k < 3; k++) {
                    sum += this.matrix[i][k] * other.matrix[k][j];
                }
                result[i][j] = sum;
            }
        }
        return new Matrix(result);
    }

    applyTransformationToPoint(point: IPoint): IPoint {
        const x = point.x;
        const y = point.y;
        const newX = this.matrix[0][0] * x + this.matrix[0][1] * y + this.matrix[0][2];
        const newY = this.matrix[1][0] * x + this.matrix[1][1] * y + this.matrix[1][2];
        return {x: newX, y: newY};
    }
}