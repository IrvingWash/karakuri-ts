export async function initializeGPU(ctx: GPUCanvasContext): Promise<[GPUDevice, GPUCanvasContext]> {
    const adapter = await navigator.gpu.requestAdapter();
    const device = await adapter?.requestDevice({ label: "Rendering device" });

    if (device === undefined) {
        throw new Error("Failed to request GPU device");
    }

    ctx.configure({
        device,
        format: navigator.gpu.getPreferredCanvasFormat(),
    });

    device.lost.then(onDeviceLost);

    return [device, ctx];
}

function onDeviceLost(info: GPUDeviceLostInfo): void {
    throw new Error(`GPU device lost: ${info.reason}: ${info.message}`);
};
