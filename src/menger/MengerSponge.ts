import { Mat4 } from "../lib/TSM.js";

/* A potential interface that students should implement */
interface IMengerSponge {
  setLevel(level: number): void;
  isDirty(): boolean;
  setClean(): void;
  normalsFlat(): Float32Array;
  indicesFlat(): Uint32Array;
  positionsFlat(): Float32Array;
}

/**
 * Represents a Menger Sponge
 */
export class MengerSponge implements IMengerSponge {
  private dirty: boolean = true;
  private level: number = 1;
  private positions: Float32Array = new Float32Array(0);
  private indices: Uint32Array = new Uint32Array(0);
  private normals: Float32Array = new Float32Array(0);
  private readonly modelMatrix: Mat4 = new Mat4().setIdentity();
  
  constructor(level: number) {
	  this.setLevel(level);
  }

  /**
   * Returns true if the sponge has changed.
   */
  public isDirty(): boolean {
    return this.dirty;
  }

  public setClean(): void {
    this.dirty = false;
  }
  
  public setLevel(level: number) : void {
    const nextLevel = Math.max(1, Math.min(4, Math.floor(level)));
    this.level = nextLevel;
    this.rebuildGeometry();
    this.dirty = true;
  }

  /* Returns a flat Float32Array of the sponge's vertex positions */
  public positionsFlat(): Float32Array {
	  return this.positions;
  }

  /**
   * Returns a flat Uint32Array of the sponge's face indices
   */
  public indicesFlat(): Uint32Array {
    return this.indices;
  }

  /**
   * Returns a flat Float32Array of the sponge's normals
   */
  public normalsFlat(): Float32Array {
	  return this.normals;
  }

  /**
   * Returns the model matrix of the sponge
   */
  public uMatrix(): Mat4 {
    return this.modelMatrix;
  }

  private rebuildGeometry(): void {
    type Cube = {
      minX: number;
      minY: number;
      minZ: number;
      maxX: number;
      maxY: number;
      maxZ: number;
    };

    let cubes: Cube[] = [
      {
        minX: -0.5,
        minY: -0.5,
        minZ: -0.5,
        maxX: 0.5,
        maxY: 0.5,
        maxZ: 0.5
      }
    ];

    for (let currentLevel = 2; currentLevel <= this.level; currentLevel++) {
      const next: Cube[] = [];

      cubes.forEach((cube) => {
        const stepX = (cube.maxX - cube.minX) / 3.0;
        const stepY = (cube.maxY - cube.minY) / 3.0;
        const stepZ = (cube.maxZ - cube.minZ) / 3.0;

        for (let ix = 0; ix < 3; ix++) {
          for (let iy = 0; iy < 3; iy++) {
            for (let iz = 0; iz < 3; iz++) {
              let middleCount = 0;
              if (ix === 1) middleCount++;
              if (iy === 1) middleCount++;
              if (iz === 1) middleCount++;
              if (middleCount >= 2) {
                continue;
              }

              next.push({
                minX: cube.minX + ix * stepX,
                minY: cube.minY + iy * stepY,
                minZ: cube.minZ + iz * stepZ,
                maxX: cube.minX + (ix + 1) * stepX,
                maxY: cube.minY + (iy + 1) * stepY,
                maxZ: cube.minZ + (iz + 1) * stepZ
              });
            }
          }
        }
      });

      cubes = next;
    }

    const positionData: number[] = [];
    const normalData: number[] = [];
    const indexData: number[] = [];

    cubes.forEach((cube) => {
      this.appendCube(
        positionData,
        normalData,
        indexData,
        cube.minX,
        cube.minY,
        cube.minZ,
        cube.maxX,
        cube.maxY,
        cube.maxZ
      );
    });

    this.positions = new Float32Array(positionData);
    this.normals = new Float32Array(normalData);
    this.indices = new Uint32Array(indexData);
  }

  private appendCube(
    positions: number[],
    normals: number[],
    indices: number[],
    minX: number,
    minY: number,
    minZ: number,
    maxX: number,
    maxY: number,
    maxZ: number
  ): void {
    const appendFace = (
      v0: [number, number, number],
      v1: [number, number, number],
      v2: [number, number, number],
      v3: [number, number, number],
      normal: [number, number, number]
    ): void => {
      const base = positions.length / 4;
      const verts = [v0, v1, v2, v3];
      verts.forEach((v) => {
        positions.push(v[0], v[1], v[2], 1.0);
        normals.push(normal[0], normal[1], normal[2], 0.0);
      });
      indices.push(base, base + 1, base + 2, base, base + 2, base + 3);
    };

    appendFace(
      [maxX, minY, minZ],
      [maxX, maxY, minZ],
      [maxX, maxY, maxZ],
      [maxX, minY, maxZ],
      [1.0, 0.0, 0.0]
    );
    appendFace(
      [minX, minY, minZ],
      [minX, minY, maxZ],
      [minX, maxY, maxZ],
      [minX, maxY, minZ],
      [-1.0, 0.0, 0.0]
    );
    appendFace(
      [minX, maxY, minZ],
      [minX, maxY, maxZ],
      [maxX, maxY, maxZ],
      [maxX, maxY, minZ],
      [0.0, 1.0, 0.0]
    );
    appendFace(
      [minX, minY, minZ],
      [maxX, minY, minZ],
      [maxX, minY, maxZ],
      [minX, minY, maxZ],
      [0.0, -1.0, 0.0]
    );
    appendFace(
      [minX, minY, maxZ],
      [maxX, minY, maxZ],
      [maxX, maxY, maxZ],
      [minX, maxY, maxZ],
      [0.0, 0.0, 1.0]
    );
    appendFace(
      [minX, minY, minZ],
      [minX, maxY, minZ],
      [maxX, maxY, minZ],
      [maxX, minY, minZ],
      [0.0, 0.0, -1.0]
    );
  }
  
}
