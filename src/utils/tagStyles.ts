// Tag colors mapping for consistent styling across components
export const tagColors: Record<string, string> = {
	default: "text-pink-400",
};

// Get the appropriate color class for a tag
export function getTagColor(tagVal: string): string {
	void tagVal;
	return tagColors.default;
} 