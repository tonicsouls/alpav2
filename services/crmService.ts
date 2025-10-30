import { CrmResult } from '../types';
import { MOCK_CRM_RECORDS } from '../data/mockCrm';

/**
 * Simulates calling a CRM API to validate a customer and get their short ID.
 * It searches across multiple fields in the mock CRM database.
 * @param identifier The customer identifier extracted from the document.
 * @returns A promise that resolves with a CrmResult.
 */
export const getCustomerShortId = (identifier: string): Promise<CrmResult> => {
    return new Promise((resolve) => {
        // Simulate network delay
        setTimeout(() => {
            const normalizedIdentifier = identifier.trim().toLowerCase();
            
            const foundRecord = MOCK_CRM_RECORDS.find(record => 
                record.fullName.toLowerCase() === normalizedIdentifier ||
                record.email.toLowerCase() === normalizedIdentifier ||
                record.company.toLowerCase() === normalizedIdentifier ||
                record.accountNumber.toLowerCase() === normalizedIdentifier
            );

            if (foundRecord) {
                resolve({
                    isValid: true,
                    shortId: foundRecord.shortId,
                });
            } else {
                resolve({
                    isValid: false,
                    shortId: null,
                });
            }
        }, 800 + Math.random() * 500); // Realistic random delay
    });
};
