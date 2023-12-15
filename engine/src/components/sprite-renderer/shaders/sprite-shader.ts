export const spriteShader = `
    struct VertexOut {
        @builtin(position) position: vec4f,
        @location(0) textureCoordinates: vec2f,
    }

    @group(0) @binding(0)
    var<uniform> projectionMatrix: mat4x4f;

    @vertex
    fn vs_main(
        @location(0) pos: vec2f,
        @location(1) textureCoordinates: vec2f,
    ) -> VertexOut {
        var output: VertexOut;

        output.position = projectionMatrix * vec4f(pos, 0, 1);
        output.textureCoordinates = textureCoordinates;

        return output;
    }

    @group(1) @binding(0)
    var texSampler: sampler;

    @group(1) @binding(1)
    var tex: texture_2d<f32>;

    @fragment
    fn fs_main(frag_data: VertexOut) -> @location(0) vec4f {
        var textureColor = textureSample(tex, texSampler, frag_data.textureCoordinates);

        return textureColor;
    }
`;
