// Define the Flyweight object for font family (shared state)
class FontFamily {
    readonly family: string;

    constructor(family: string) {
        this.family = family;
    }
}

// Define the Flyweight object for font style, size, and color (external state)
class DocumentFont {
    readonly style: string;
    readonly size: number;
    readonly color: string;
    readonly family: FontFamily;

    constructor(family: FontFamily, style: string, size: number, color: string) {
        this.family = family;
        this.style = style;
        this.size = size;
        this.color = color;
    }
}

// Define the Flyweight Factory to manage FontFamily objects
class FontFamilyFactory {
    private families: Map<string, FontFamily> = new Map();

    getFontFamily(family: string): FontFamily {
        if (!this.families.has(family)) {
            this.families.set(family, new FontFamily(family));
        }
        return this.families.get(family)!;
    }
}

// Define the DocumentFontFactory to manage DocumentFont objects
class DocumentFontFactory {
    private fonts: Map<string, DocumentFont> = new Map();

    constructor(private familyFactory: FontFamilyFactory) {}

    getFont(family: string, style: string, size: number, color: string): DocumentFont {
        const key = `${family}-${style}-${size}-${color}`;
        if (!this.fonts.has(key)) {
            const fontFamily = this.familyFactory.getFontFamily(family); // Reuse font family
            this.fonts.set(key, new DocumentFont(fontFamily, style, size, color));
        }
        return this.fonts.get(key)!;
    }
}

// Namespace to avoid conflicts with global Document object
namespace DocumentEditor {
    export class TextDocument {
        private content: string;
        private font: DocumentFont;

        constructor(content: string, family: string, style: string, size: number, color: string, fontFactory: DocumentFontFactory) {
            this.content = content;
            this.font = fontFactory.getFont(family, style, size, color);
        }

        render(): void {
            console.log(`Content: ${this.content}`);
            console.log(`Using Font: ${this.font.family.family}, ${this.font.style}, Size: ${this.font.size}, Color: ${this.font.color}`);
        }
    }
}

// Using the namespaced TextDocument class
function runExample() {
    const familyFactory = new FontFamilyFactory();
    const fontFactory = new DocumentFontFactory(familyFactory);

    const document1 = new DocumentEditor.TextDocument("Document 1: Introduction", "Arial", "Regular", 12, "Black", fontFactory);
    const document2 = new DocumentEditor.TextDocument("Document 2: Conclusion", "Times New Roman", "Italic", 14, "Blue", fontFactory);
    const document3 = new DocumentEditor.TextDocument("Document 3: Summary", "Arial", "Bold", 10, "Red", fontFactory);

    // Render the documents
    console.log("Rendering Documents:");
    document1.render();
    console.log("---");
    document2.render();
    console.log("---");
    document3.render();
}

// Run the example to see output
runExample();
