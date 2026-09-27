export default class Adapter {
  loader: any;
  reader: FileReader | null = null;
  config: any;
  currentFile: File | null = null;

  constructor(loader: any, config: any) {
    this.loader = loader;
    this.config = config;
  }

  public async upload(): Promise<any> {
    const file = await this.loader.file;

    if (!file) {
      throw new Error("No file provided.");
    }

    this.currentFile = file;

    return this.read(file);
  }

  private read(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      this.abort();

      this.reader = new FileReader();

      this.reader.onload = () => {
        resolve({ default: this.reader?.result });
      };

      this.reader.onerror = (error) => {
        reject(error);
      };

      this.reader.onabort = () => {
        reject(new Error("File reading aborted."));
      };

      this.reader.readAsDataURL(file);
    });
  }

  public abort(): void {
    if (this.reader) {
      this.reader.abort();
      this.reader = null;
    }
  }
}
