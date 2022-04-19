export default abstract class StorageSignAbstract {
    abstract encryptName(plaintext: string): string;
    abstract encryptValue(plaintext: string): string;
    abstract decryptValue(ciphertext: string): string;
}
