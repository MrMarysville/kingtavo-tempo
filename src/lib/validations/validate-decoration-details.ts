import { decorationDetailsJsonSchema } from './decoration-schemas';

/**
 * Validates decoration details for a line item
 * @param decorationDetails The decoration details to validate
 * @returns An object with validation result and any errors
 */
export function validateDecorationDetails(decorationDetails: unknown) {
  try {
    // Parse and validate the decoration details
    const result = decorationDetailsJsonSchema.safeParse(decorationDetails);
    
    if (result.success) {
      return {
        isValid: true,
        data: result.data,
        errors: null
      };
    } else {
      // Format the validation errors
      const formattedErrors = result.error.format();
      return {
        isValid: false,
        data: null,
        errors: formattedErrors
      };
    }
  } catch (error) {
    // Handle any unexpected errors
    return {
      isValid: false,
      data: null,
      errors: { _errors: ['Invalid decoration details format'] }
    };
  }
}

/**
 * Validates decoration details for multiple line items
 * @param lineItems Array of line items with decoration details
 * @returns An object with validation results for each line item
 */
export function validateMultipleDecorationDetails(lineItems: Array<{ id: string, decoration_details: unknown }>) {
  const results: Record<string, ReturnType<typeof validateDecorationDetails>> = {};
  
  for (const item of lineItems) {
    results[item.id] = validateDecorationDetails(item.decoration_details);
  }
  
  return results;
}

/**
 * Checks if all decoration details in an array of line items are valid
 * @param lineItems Array of line items with decoration details
 * @returns Boolean indicating if all decoration details are valid
 */
export function areAllDecorationDetailsValid(lineItems: Array<{ id: string, decoration_details: unknown }>) {
  const validationResults = validateMultipleDecorationDetails(lineItems);
  return Object.values(validationResults).every(result => result.isValid);
}
