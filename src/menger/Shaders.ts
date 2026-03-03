export let defaultVSText = `
    precision mediump float;

    attribute vec4 vertPosition;
    attribute vec4 aNorm;
    
    varying vec4 lightDir;
    varying vec4 normal;
    varying vec4 worldPos;
 
    uniform vec4 lightPosition;
    uniform mat4 mWorld;
    uniform mat4 mView;
	uniform mat4 mProj;

    void main () {
        vec4 world = mWorld * vertPosition;
        gl_Position = mProj * mView * world;
        
        lightDir = lightPosition - world;
		
        normal = aNorm;
        worldPos = world;
    }
`;

export let defaultFSText = `
    precision mediump float;

    varying vec4 lightDir;
    varying vec4 normal;
    varying vec4 worldPos;
	
    
    void main () {
        vec3 n = normalize(normal.xyz);
        vec3 l = normalize(lightDir.xyz);
        float diffuse = max(dot(n, l), 0.0);
        vec3 baseColor = abs(n);
        vec3 color = baseColor * (0.2 + 0.8 * diffuse);
        gl_FragColor = vec4(color, 1.0);
    }
`;

export let floorVSText = `
    precision highp float;

    attribute vec4 vertPosition;
    attribute vec4 aNorm;

    varying vec4 normal;
    varying vec4 worldPos;

    uniform mat4 mWorld;
    uniform mat4 mView;
    uniform mat4 mProj;

    void main() {
        worldPos = mWorld * vertPosition;
        gl_Position = mProj * mView * worldPos;
        normal = aNorm;
    }
`;

export let floorFSText = `
    precision highp float;

    varying vec4 normal;
    varying vec4 worldPos;
    uniform vec4 lightPosition;

    void main() {
        vec3 world = worldPos.xyz;
        vec3 n = normalize(normal.xyz);
        vec3 l = normalize(lightPosition.xyz - world);
        float diffuse = max(dot(n, l), 0.0);

        float xCell = floor(world.x / 5.0);
        float zCell = floor(world.z / 5.0);
        float checker = mod(xCell + zCell, 2.0);

        vec3 baseColor = mix(vec3(1.0), vec3(0.0), checker);
        vec3 color = baseColor * (0.2 + 0.8 * diffuse);
        gl_FragColor = vec4(color, 1.0);
    }
`;
