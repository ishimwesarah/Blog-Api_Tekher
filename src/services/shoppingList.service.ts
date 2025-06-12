import { AppDataSource } from "../config/database";
import { ShoppingListItem } from "../modals/ShoppingListItem";
import { User } from "../modals/user";

export class ShoppingListService {
  private itemRepository = AppDataSource.getRepository(ShoppingListItem);

  // Get all items for a specific user
  async findByUserId(userId: number): Promise<ShoppingListItem[]> {
    return this.itemRepository.find({
      where: { user: { id: userId } },
      order: { created_at: "ASC" },
    });
  }

  // Add multiple new items for a user
  async addItems(items: string[], user: User): Promise<ShoppingListItem[]> {
    const newItems = items.map(itemName => 
      this.itemRepository.create({ item: itemName, user: user })
    );
    return this.itemRepository.save(newItems);
  }

  // Toggle the isChecked status of an item
  async toggleItem(itemId: number, userId: number): Promise<ShoppingListItem | null> {
    const item = await this.itemRepository.findOne({ where: { id: itemId, user: { id: userId } } });
    if (!item) return null; // User doesn't own this item
    item.isChecked = !item.isChecked;
    return this.itemRepository.save(item);
  }

  // Delete an item from the list
  async deleteItem(itemId: number, userId: number): Promise<boolean> {
    const result = await this.itemRepository.delete({ id: itemId, user: { id: userId } });
    return result.affected !== 0;
  }
}