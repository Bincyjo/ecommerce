import os
import django
from decimal import Decimal
from PIL import Image, ImageDraw

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.conf import settings
from categories.models import Category
from products.models import Product

def create_image(name, filename, bg_color, accent_color):
    media_dir = settings.MEDIA_ROOT / 'products'
    os.makedirs(media_dir, exist_ok=True)
    file_path = media_dir / filename

    width, height = 600, 450
    img = Image.new('RGB', (width, height), color=bg_color)
    draw = ImageDraw.Draw(img)

    draw.rectangle([0, 0, width, 12], fill=accent_color)
    draw.ellipse([width - 150, -50, width + 100, 200], outline=accent_color, width=3)
    draw.ellipse([-50, height - 150, 180, height + 80], outline=accent_color, width=2)
    
    badge_box = [60, 80, width - 60, height - 80]
    draw.rounded_rectangle(badge_box, radius=16, fill=(255, 255, 255), outline=accent_color, width=2)

    shoe_points = [
        (160, 260), (220, 200), (320, 190), (370, 210), (430, 250), 
        (450, 275), (440, 295), (150, 295), (145, 280)
    ]
    draw.polygon(shoe_points, fill=accent_color)
    draw.rounded_rectangle([140, 290, 455, 312], radius=6, fill=(40, 40, 40))

    draw.text((width // 2 - 80, 110), "SHOPEASE", fill=(100, 116, 139))
    draw.text((width // 2 - 100, 140), name[:22], fill=(15, 23, 42))

    img.save(file_path, quality=90)
    return f'products/{filename}'

def run():
    print("Updating categories and catalog...")

    # Define new modern categories
    categories_dict = {
        'Running & Athletics': Category.objects.get_or_create(name='Running & Athletics')[0],
        'Streetwear Sneakers': Category.objects.get_or_create(name='Streetwear Sneakers')[0],
        'Basketball & High-Tops': Category.objects.get_or_create(name='Basketball & High-Tops')[0],
        'Formal & Loafers': Category.objects.get_or_create(name='Formal & Loafers')[0],
        'Boots & Outdoor': Category.objects.get_or_create(name='Boots & Outdoor')[0],
        "Women's Footwear": Category.objects.get_or_create(name="Women's Footwear")[0],
        'Sliders & Slip-Ons': Category.objects.get_or_create(name='Sliders & Slip-Ons')[0],
        'Shoe Care & Accessories': Category.objects.get_or_create(name='Shoe Care & Accessories')[0],
    }

    # Reassign existing products to clean new categories
    mapping = {
        1: 'Running & Athletics',
        2: 'Running & Athletics',
        3: 'Streetwear Sneakers',
        4: 'Streetwear Sneakers',
        5: 'Basketball & High-Tops',
        6: 'Basketball & High-Tops',
        7: 'Formal & Loafers',
        8: 'Boots & Outdoor',
    }

    for pid, cname in mapping.items():
        try:
            prod = Product.objects.get(id=pid)
            prod.category = categories_dict[cname]
            prod.save()
            print(f"Reassigned Product #{pid} ({prod.name}) -> {cname}")
        except Product.DoesNotExist:
            pass

    # Add new products for new categories so each has items
    new_products = [
        {
            'name': 'CloudPulse Air Glide W',
            'category': categories_dict["Women's Footwear"],
            'price': Decimal('7999.00'),
            'stock': 22,
            'img': ('women_cloudpulse.jpg', (254, 242, 242), (236, 72, 153))
        },
        {
            'name': 'Rose Quartz Retro Runner',
            'category': categories_dict["Women's Footwear"],
            'price': Decimal('8499.00'),
            'stock': 16,
            'img': ('women_retro.jpg', (253, 242, 248), (219, 39, 119))
        },
        {
            'name': 'CloudFoam Comfort Slide',
            'category': categories_dict['Sliders & Slip-Ons'],
            'price': Decimal('2499.00'),
            'stock': 40,
            'img': ('cloudfoam_slide.jpg', (240, 253, 250), (13, 148, 136))
        },
        {
            'name': 'HydroMule Slip-On Clog',
            'category': categories_dict['Sliders & Slip-Ons'],
            'price': Decimal('3299.00'),
            'stock': 25,
            'img': ('hydromule.jpg', (245, 245, 244), (120, 113, 108))
        },
        {
            'name': 'Royal Penny Suede Loafer',
            'category': categories_dict['Formal & Loafers'],
            'price': Decimal('9499.00'),
            'stock': 14,
            'img': ('royal_loafer.jpg', (254, 243, 199), (180, 83, 9))
        },
        {
            'name': 'Premium Waterproof Shield Spray',
            'category': categories_dict['Shoe Care & Accessories'],
            'price': Decimal('1299.00'),
            'stock': 50,
            'img': ('shield_spray.jpg', (238, 242, 255), (79, 70, 229))
        },
        {
            'name': 'Orthopedic Ergonomic Insoles',
            'category': categories_dict['Shoe Care & Accessories'],
            'price': Decimal('1699.00'),
            'stock': 35,
            'img': ('insoles.jpg', (241, 245, 249), (51, 65, 85))
        },
    ]

    for p in new_products:
        img_path = create_image(p['name'], p['img'][0], p['img'][1], p['img'][2])
        prod, created = Product.objects.get_or_create(
            name=p['name'],
            defaults={
                'category': p['category'],
                'price': p['price'],
                'stock': p['stock'],
                'image': img_path,
            }
        )
        if not created:
            prod.category = p['category']
            prod.price = p['price']
            prod.stock = p['stock']
            if not prod.image:
                prod.image = img_path
            prod.save()
        print(f"Added product: {prod.name} -> {prod.category.name} ({prod.price})")

    # Clean up empty old categories that have 0 products
    for old_cat in Category.objects.all():
        if old_cat.products.count() == 0 and old_cat.name not in categories_dict:
            print(f"Removing empty legacy category: {old_cat.name}")
            old_cat.delete()

    print("Category & product refresh complete!")

if __name__ == '__main__':
    run()
