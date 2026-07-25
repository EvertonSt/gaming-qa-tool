/**
 * Game Compatibility Analyzer
 * Validates game requirements against user hardware/platform specs
 */

class CompatibilityAnalyzer {
  /**
   * Analyze game compatibility with given system specs
   * @param {Object} gameReq - Game minimum/recommended requirements
   * @param {Object} systemSpecs - User system specifications
   * @returns {Object} Compatibility report
   */
  analyze(gameReq, systemSpecs) {
    const checks = {
      os: this._checkOS(gameReq.os, systemSpecs.os),
      cpu: this._checkCPU(gameReq.cpu, systemSpecs.cpu),
      gpu: this._checkGPU(gameReq.gpu, systemSpecs.gpu),
      ram: this._checkRAM(gameReq.ram, systemSpecs.ram),
      storage: this._checkStorage(gameReq.storage, systemSpecs.storage),
      directx: this._checkDirectX(gameReq.directx, systemSpecs.directx)
    };

    const passed = Object.values(checks).filter(c => c.status === 'pass').length;
    const warnings = Object.values(checks).filter(c => c.status === 'warning').length;
    const failed = Object.values(checks).filter(c => c.status === 'fail').length;

    let level = 'incompatible';
    if (failed === 0 && warnings === 0) level = 'recommended';
    else if (failed === 0) level = 'minimum';

    const score = Math.round(
      (passed * 100 + warnings * 50) / Object.keys(checks).length
    );

    return {
      level,
      score,
      checks,
      summary: this._generateSummary(level, passed, warnings, failed)
    };
  }

  _checkOS(reqOS, sysOS) {
    if (!reqOS) return { status: 'pass', message: 'No OS requirement specified' };
    const compatible = reqOS.includes(sysOS) || sysOS.includes('Windows');
    return {
      status: compatible ? 'pass' : 'fail',
      message: compatible ? `OS compatible: ${sysOS}` : `OS mismatch: requires ${reqOS}, has ${sysOS}`
    };
  }

  _checkCPU(reqCPU, sysCPU) {
    if (!reqCPU || !sysCPU) return { status: 'warning', message: 'CPU info incomplete' };
    // Simplified: compare by extracting core count or generation
    const reqCores = this._extractNumber(reqCPU);
    const sysCores = this._extractNumber(sysCPU);
    if (sysCores >= reqCores) {
      return { status: 'pass', message: `CPU sufficient: ${sysCPU}` };
    }
    return { status: 'warning', message: `CPU below recommended: ${sysCPU} vs ${reqCPU}` };
  }

  _checkGPU(reqGPU, sysGPU) {
    if (!reqGPU || !sysGPU) return { status: 'warning', message: 'GPU info incomplete' };
    const reqTier = this._gpuTier(reqGPU);
    const sysTier = this._gpuTier(sysGPU);
    if (sysTier >= reqTier) {
      return { status: 'pass', message: `GPU sufficient: ${sysGPU}` };
    }
    return { status: 'warning', message: `GPU below recommended: ${sysGPU}` };
  }

  _checkRAM(reqRAM, sysRAM) {
    if (!reqRAM || !sysRAM) return { status: 'warning', message: 'RAM info incomplete' };
    if (sysRAM >= reqRAM) return { status: 'pass', message: `RAM sufficient: ${sysRAM}GB` };
    if (sysRAM >= reqRAM * 0.75) return { status: 'warning', message: `RAM below recommended: ${sysRAM}GB` };
    return { status: 'fail', message: `RAM insufficient: ${sysRAM}GB (need ${reqRAM}GB)` };
  }

  _checkStorage(reqStorage, sysStorage) {
    if (!reqStorage || !sysStorage) return { status: 'warning', message: 'Storage info incomplete' };
    if (sysStorage >= reqStorage) return { status: 'pass', message: `Storage sufficient: ${sysStorage}GB` };
    return { status: 'fail', message: `Storage insufficient: ${sysStorage}GB (need ${reqStorage}GB)` };
  }

  _checkDirectX(reqDX, sysDX) {
    if (!reqDX) return { status: 'pass', message: 'No DirectX requirement' };
    if (!sysDX) return { status: 'warning', message: 'DirectX version unknown' };
    if (sysDX >= reqDX) return { status: 'pass', message: `DirectX ${sysDX} compatible` };
    return { status: 'fail', message: `DirectX ${reqDX} required, has ${sysDX}` };
  }

  _extractNumber(str) {
    const match = str.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  }

  _gpuTier(gpu) {
    const lower = gpu.toLowerCase();
    if (lower.includes('rtx 40') || lower.includes('rx 7')) return 4;
    if (lower.includes('rtx 30') || lower.includes('rx 6')) return 3;
    if (lower.includes('gtx 16') || lower.includes('rx 5') || lower.includes('gtx 10')) return 2;
    if (lower.includes('gtx') || lower.includes('rx')) return 1;
    return 0;
  }

  _generateSummary(level, passed, warnings, failed) {
    if (level === 'recommended') return 'Fully compatible at recommended settings';
    if (level === 'minimum') return 'Compatible at minimum settings with minor warnings';
    return `Incompatible: ${failed} critical failure(s), ${warnings} warning(s)`;
  }
}

module.exports = { CompatibilityAnalyzer };