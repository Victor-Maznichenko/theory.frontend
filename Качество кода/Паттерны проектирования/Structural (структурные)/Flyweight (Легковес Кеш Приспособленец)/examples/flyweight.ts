/**
 * The DocumentFontFactory manages the creation and sharing of font flyweights
 * for documents. It ensures that font flyweights representing the same font
 * family and style are shared among multiple documents to reduce memory usage
 * and improve performance.
 */
// A fine-grained instance used for efficient sharing

// Define the Flyweight object
class DocumentFont {
    readonly family: string;
    readonly style: string;
    readonly size: number;
    readonly color: string;

    constructor(family: string, style: string, size: number, color: string) {
        this.family = family;
        this.style = style;
        this.size = size;
        this.color = color;
    }
}

// Define the Flyweight Factory
class DocumentFontFactory {
    private fonts: Map<string, DocumentFont> = new Map();

    getFont(family: string, style: string, size: number, color: string): DocumentFont {
        const key = `${family}-${style}-${size}-${color}`;
        if (!this.fonts.has(key)) {
            this.fonts.set(key, new DocumentFont(family, style, size, color));
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
            console.log(`Using Font: ${this.font.family}, ${this.font.style}, Size: ${this.font.size}, Color: ${this.font.color}`);
        }
    }
}

// Using the namespaced TextDocument class
function runExample() {
    const fontFactory = new DocumentFontFactory();
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