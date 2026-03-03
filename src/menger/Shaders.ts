export let defaultVSText = `
    precision mediump float;

    attribute vec4 vertPosition;
    attribute vec4 aNorm;
    
    varying vec4 lightDir;
    varying vec4 normal;
 
    uniform vec4 lightPosition;
    uniform mat4 mWorld;
    uniform mat4 mView;
    uniform mat4 mProj;

    void main () {
        gl_Position = mProj * mView * mWorld * vertPosition;
        
        vec4 world = mWorld * vertPosition;
        lightDir = lightPosition - world;
        normal = mWorld * aNorm;
    }
`;

export let defaultFSText = `
    precision mediump float;

    varying vec4 lightDir;
    varying vec4 normal;
    
    void main () {
        vec3 n = normalize(normal.xyz);
        vec3 l = normalize(lightDir.xyz);
        
        float diffuse = max(dot(n, l), 0.0);
        vec3 baseColor = abs(n);
        
        // Pure Lambertian diffuse, 0.0 ambient offset
        vec3 color = baseColor * diffuse;
        
        gl_FragColor = vec4(color, 1.0);
    }
`;

export let floorVSText = `
    precision highp float;

    attribute vec4 vertPosition;
    attribute vec4 aNorm;

    varying vec4 normal;
    varying vec4 worldPos;
    varying vec4 viewPos;

    uniform mat4 mWorld;
    uniform mat4 mView;
    uniform mat4 mProj;

    void main() {
        worldPos = mWorld * vertPosition;
        viewPos = mView * worldPos;
        gl_Position = mProj * mView * worldPos;
        normal = aNorm;
    }
`;

export let floorFSText = `
    precision highp float;

    varying vec4 normal;
    varying vec4 worldPos;
    varying vec4 viewPos;

    uniform vec4 lightPosition;

    void main() {
        vec3 world = worldPos.xyz;
        vec3 n = normalize(normal.xyz);
        vec3 l = normalize(lightPosition.xyz - world);
        float diffuse = max(dot(n, l), 0.0);

        float xCell = floor(world.x / 5.0);
        float zCell = floor(world.z / 5.0);
        float checker = mod(xCell + zCell, 2.0);

        vec3 baseColor = mix(vec3(0.0), vec3(1.0), checker);
        float dist = length(viewPos.xyz);
        float fog = exp(-0.005 * dist);
        vec3 color = baseColor * (0.1 + 0.9 * diffuse) * clamp(fog, 0.0, 1.0);
        gl_FragColor = vec4(color, 1.0);
    }
`;