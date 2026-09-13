export const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragmentShader = `
  uniform sampler2D u_texture;
  uniform vec2 u_mouse; 
  uniform vec2 u_resolution;
  uniform float u_time;

  varying vec2 vUv;

  void main() {
    vec4 baseColor = texture2D(u_texture, vUv);
    
    // Aspect ratio correction so the light beam isn't stretched
    float aspect = u_resolution.x / u_resolution.y;
    vec2 center = vec2(0.5);
    
    vec2 st = vUv - center;
    st.x *= aspect;
    
    vec2 mouse = u_mouse - center;
    mouse.x *= aspect;
    
    float dist = distance(st, mouse);
    
    // Flashlight parameters
    float radius = 0.35;   // Size of the beam
    float softness = 0.20; // Blurriness of the edge
    
    float light = 1.0 - smoothstep(radius - softness, radius, dist);
    
    // Higher ambient light so the dark cabin silhouette is faintly visible
    float ambient = 0.15; 
    
    // Calculate final color
    vec3 finalColor = baseColor.rgb * (ambient + light);
    
    // Add a warm, luxury "tungsten" tint to the light beam
    finalColor += vec3(0.15, 0.08, 0.02) * light; 
    
    gl_FragColor = vec4(finalColor, 1.0);
  }
`;
