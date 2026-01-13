/**
 * Represents a category configuration used in the application.
 */
export interface CategoryData {
    id?:number;

    /** Display name of the category */
    name: string;

    /** Icon identifier (e.g. Bootstrap Icons, Material Icons) */
    icon: string;

    /** Primary color associated with the category */
    color: string;

    /** Background color used for UI elements */
    background_color: string;

    user_id: string;
}
