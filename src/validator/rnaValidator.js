export function validateRNA(row) {
    const errors = [];
    
    const result = {
        templateId: row.templateId || null,
        concentration: null,
        a260280: null,
        a260230: null
    };

    if (!row.templateId || String(row.templateId).trim() === '') {
        errors.push('模板ID不能为空');
    } else {
        result.templateId = String(row.templateId).trim();
    }

    if (row.concentration !== undefined && row.concentration !== null && row.concentration !== '') {
        const num = Number(row.concentration);
        if (isNaN(num) || num < 0) {
            errors.push('RNA浓度必须为非负数字');
        } else {
            result.concentration = num;
        }
    }

    if (row.a260280 !== undefined && row.a260280 !== null && row.a260280 !== '') {
        const num = Number(row.a260280);
        if (isNaN(num)) {
            errors.push('A260/280必须为数字');
        } else {
            result.a260280 = num;
        }
    }

    if (row.a260230 !== undefined && row.a260230 !== null && row.a260230 !== '') {
        const num = Number(row.a260230);
        if (isNaN(num)) {
            errors.push('A260/230必须为数字');
        } else {
            result.a260230 = num;
        }
    }

    return {
        valid: errors.length === 0,
        errors,
        data: result
    };
}

export function validateRNABatch(rows) {
    const results = [];
    let allValid = true;
    
    rows.forEach((row, index) => {
        const result = validateRNA(row);
        results.push({
            rowIndex: index + 1,
            ...result
        });
        if (!result.valid) {
            allValid = false;
        }
    });

    return {
        allValid,
        results,
        validCount: results.filter(r => r.valid).length,
        invalidCount: results.filter(r => !r.valid).length
    };
}