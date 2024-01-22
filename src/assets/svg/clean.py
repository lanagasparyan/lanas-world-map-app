import xml.etree.ElementTree as ET
with open('./world-map_old.svg', 'r') as svg_file:
    svg_content = svg_file.read()
# Parse the SVG XML content


# Function to remove namespaces from the XML tags
def remove_namespaces(xml_content):
    # Removing xmlns attribute (namespace declaration) from the root element
    xml_content = xml_content.replace('xmlns="http://www.w3.org/2000/svg"', '')
    return xml_content


# Remove namespaces from the original SVG content
svg_content_no_ns = remove_namespaces(svg_content)

# Parse the modified SVG content
svg_tree_no_ns = ET.ElementTree(ET.fromstring(svg_content_no_ns))

# Iterate over all <g> elements and add 'data-country-code'
# attribute to their child <path> elements
for g_elem in svg_tree_no_ns.iter(tag='g'):
    # Use the 'id' of the <g> element as the country code
    country_code = g_elem.get('id')
    if country_code:
        for path_elem in g_elem.findall('path'):
            path_elem.set('data-country-code', country_code)

# Convert the updated tree back into a string
updated_svg_string = ET.tostring(svg_tree_no_ns.getroot(), encoding='unicode')

# Save the updated SVG string to a new file
modified_svg_path_no_ns = './world-map.svg'
with open(modified_svg_path_no_ns, 'w') as modified_svg_file:
    modified_svg_file.write(updated_svg_string)

modified_svg_path_no_ns

