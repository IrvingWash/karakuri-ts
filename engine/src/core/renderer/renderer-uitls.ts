export function createBuffer(
    device: GPUDevice,
    data: Float32Array | Uint16Array,
    type: GPUFlagsConstant,
    label?: string,
): GPUBuffer {
    const buffer = device.createBuffer({
        size: data.byteLength,
        label,
        usage: type | GPUBufferUsage.COPY_DST,
    });

    device.queue.writeBuffer(buffer, 0, data);

    return buffer;
}
