export const filledMonochromeShapeShader = `
    struct VertexOutput {
        @builtin(position) position: vec4f,
        @location(0) color: vec4f,
    }

    @group(0) @binding(0)
    var<uniform> viewPort: mat4x4f;

    @vertex
    fn vs_main(
        @location(0) position: vec2f,
        @location(1) color: vec4f
    ) -> VertexOutput {
        var output: VertexOutput;

        output.position = viewPort * vec4f(position, 0, 1);
        output.color = color;

        return output;
    }

    @fragment
    fn fs_main(params: VertexOutput) -> @location(0) vec4f {
        return params.color;
    }
`;
