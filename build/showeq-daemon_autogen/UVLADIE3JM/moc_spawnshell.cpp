/****************************************************************************
** Meta object code from reading C++ file 'spawnshell.h'
**
** Created by: The Qt Meta Object Compiler version 67 (Qt 5.15.13)
**
** WARNING! All changes made in this file will be lost!
*****************************************************************************/

#include <memory>
#include "../../../../showeq-daemon/src/spawnshell.h"
#include <QtCore/qbytearray.h>
#include <QtCore/qmetatype.h>
#if !defined(Q_MOC_OUTPUT_REVISION)
#error "The header file 'spawnshell.h' doesn't include <QObject>."
#elif Q_MOC_OUTPUT_REVISION != 67
#error "This file was generated using the moc from 5.15.13. It"
#error "cannot be used with the include files from this version of Qt."
#error "(The moc has changed too much.)"
#endif

QT_BEGIN_MOC_NAMESPACE
QT_WARNING_PUSH
QT_WARNING_DISABLE_DEPRECATED
struct qt_meta_stringdata_SpawnShell_t {
    QByteArrayData data[88];
    char stringdata0[910];
};
#define QT_MOC_LITERAL(idx, ofs, len) \
    Q_STATIC_BYTE_ARRAY_DATA_HEADER_INITIALIZER_WITH_OFFSET(len, \
    qptrdiff(offsetof(qt_meta_stringdata_SpawnShell_t, stringdata0) + ofs \
        - idx * sizeof(QByteArrayData)) \
    )
static const qt_meta_stringdata_SpawnShell_t qt_meta_stringdata_SpawnShell = {
    {
QT_MOC_LITERAL(0, 0, 10), // "SpawnShell"
QT_MOC_LITERAL(1, 11, 7), // "addItem"
QT_MOC_LITERAL(2, 19, 0), // ""
QT_MOC_LITERAL(3, 20, 11), // "const Item*"
QT_MOC_LITERAL(4, 32, 4), // "item"
QT_MOC_LITERAL(5, 37, 7), // "delItem"
QT_MOC_LITERAL(6, 45, 10), // "changeItem"
QT_MOC_LITERAL(7, 56, 8), // "uint32_t"
QT_MOC_LITERAL(8, 65, 10), // "changeType"
QT_MOC_LITERAL(9, 76, 9), // "killSpawn"
QT_MOC_LITERAL(10, 86, 8), // "deceased"
QT_MOC_LITERAL(11, 95, 6), // "killer"
QT_MOC_LITERAL(12, 102, 8), // "uint16_t"
QT_MOC_LITERAL(13, 111, 8), // "killerId"
QT_MOC_LITERAL(14, 120, 11), // "selectSpawn"
QT_MOC_LITERAL(15, 132, 15), // "spawnConsidered"
QT_MOC_LITERAL(16, 148, 10), // "clearItems"
QT_MOC_LITERAL(17, 159, 9), // "numSpawns"
QT_MOC_LITERAL(18, 169, 5), // "clear"
QT_MOC_LITERAL(19, 175, 13), // "newGroundItem"
QT_MOC_LITERAL(20, 189, 14), // "const uint8_t*"
QT_MOC_LITERAL(21, 204, 6), // "size_t"
QT_MOC_LITERAL(22, 211, 7), // "uint8_t"
QT_MOC_LITERAL(23, 219, 16), // "removeGroundItem"
QT_MOC_LITERAL(24, 236, 13), // "newDoorSpawns"
QT_MOC_LITERAL(25, 250, 12), // "newDoorSpawn"
QT_MOC_LITERAL(26, 263, 10), // "doorStruct"
QT_MOC_LITERAL(27, 274, 10), // "zoneSpawns"
QT_MOC_LITERAL(28, 285, 7), // "zspawns"
QT_MOC_LITERAL(29, 293, 3), // "len"
QT_MOC_LITERAL(30, 297, 9), // "zoneEntry"
QT_MOC_LITERAL(31, 307, 5), // "spawn"
QT_MOC_LITERAL(32, 313, 8), // "newSpawn"
QT_MOC_LITERAL(33, 322, 11), // "spawnStruct"
QT_MOC_LITERAL(34, 334, 1), // "s"
QT_MOC_LITERAL(35, 336, 13), // "playerUpdate2"
QT_MOC_LITERAL(36, 350, 7), // "pupdate"
QT_MOC_LITERAL(37, 358, 12), // "playerUpdate"
QT_MOC_LITERAL(38, 371, 13), // "npcMoveUpdate"
QT_MOC_LITERAL(39, 385, 9), // "npcupdate"
QT_MOC_LITERAL(40, 395, 11), // "updateSpawn"
QT_MOC_LITERAL(41, 407, 2), // "id"
QT_MOC_LITERAL(42, 410, 7), // "int16_t"
QT_MOC_LITERAL(43, 418, 1), // "x"
QT_MOC_LITERAL(44, 420, 1), // "y"
QT_MOC_LITERAL(45, 422, 1), // "z"
QT_MOC_LITERAL(46, 424, 4), // "xVel"
QT_MOC_LITERAL(47, 429, 4), // "yVel"
QT_MOC_LITERAL(48, 434, 4), // "zVel"
QT_MOC_LITERAL(49, 439, 6), // "int8_t"
QT_MOC_LITERAL(50, 446, 7), // "heading"
QT_MOC_LITERAL(51, 454, 12), // "deltaHeading"
QT_MOC_LITERAL(52, 467, 9), // "animation"
QT_MOC_LITERAL(53, 477, 12), // "updateSpawns"
QT_MOC_LITERAL(54, 490, 7), // "updates"
QT_MOC_LITERAL(55, 498, 15), // "updateSpawnInfo"
QT_MOC_LITERAL(56, 514, 11), // "spawnupdate"
QT_MOC_LITERAL(57, 526, 11), // "renameSpawn"
QT_MOC_LITERAL(58, 538, 12), // "renameupdate"
QT_MOC_LITERAL(59, 551, 13), // "illusionSpawn"
QT_MOC_LITERAL(60, 565, 14), // "illusionupdate"
QT_MOC_LITERAL(61, 580, 21), // "updateSpawnAppearance"
QT_MOC_LITERAL(62, 602, 16), // "appearanceupdate"
QT_MOC_LITERAL(63, 619, 11), // "shroudSpawn"
QT_MOC_LITERAL(64, 631, 11), // "updateNpcHP"
QT_MOC_LITERAL(65, 643, 8), // "hpupdate"
QT_MOC_LITERAL(66, 652, 18), // "spawnWearingUpdate"
QT_MOC_LITERAL(67, 671, 7), // "wearing"
QT_MOC_LITERAL(68, 679, 11), // "consMessage"
QT_MOC_LITERAL(69, 691, 3), // "con"
QT_MOC_LITERAL(70, 695, 11), // "removeSpawn"
QT_MOC_LITERAL(71, 707, 7), // "rmSpawn"
QT_MOC_LITERAL(72, 715, 3), // "dir"
QT_MOC_LITERAL(73, 719, 11), // "deleteSpawn"
QT_MOC_LITERAL(74, 731, 8), // "delSpawn"
QT_MOC_LITERAL(75, 740, 9), // "deadspawn"
QT_MOC_LITERAL(76, 750, 16), // "respawnFromHover"
QT_MOC_LITERAL(77, 767, 7), // "respawn"
QT_MOC_LITERAL(78, 775, 9), // "corpseLoc"
QT_MOC_LITERAL(79, 785, 15), // "playerChangedID"
QT_MOC_LITERAL(80, 801, 11), // "oldPlayerID"
QT_MOC_LITERAL(81, 813, 11), // "newPlayerID"
QT_MOC_LITERAL(82, 825, 14), // "refilterSpawns"
QT_MOC_LITERAL(83, 840, 21), // "refilterSpawnsRuntime"
QT_MOC_LITERAL(84, 862, 10), // "saveSpawns"
QT_MOC_LITERAL(85, 873, 13), // "restoreSpawns"
QT_MOC_LITERAL(86, 887, 14), // "updateGuildTag"
QT_MOC_LITERAL(87, 902, 7) // "guildId"

    },
    "SpawnShell\0addItem\0\0const Item*\0item\0"
    "delItem\0changeItem\0uint32_t\0changeType\0"
    "killSpawn\0deceased\0killer\0uint16_t\0"
    "killerId\0selectSpawn\0spawnConsidered\0"
    "clearItems\0numSpawns\0clear\0newGroundItem\0"
    "const uint8_t*\0size_t\0uint8_t\0"
    "removeGroundItem\0newDoorSpawns\0"
    "newDoorSpawn\0doorStruct\0zoneSpawns\0"
    "zspawns\0len\0zoneEntry\0spawn\0newSpawn\0"
    "spawnStruct\0s\0playerUpdate2\0pupdate\0"
    "playerUpdate\0npcMoveUpdate\0npcupdate\0"
    "updateSpawn\0id\0int16_t\0x\0y\0z\0xVel\0"
    "yVel\0zVel\0int8_t\0heading\0deltaHeading\0"
    "animation\0updateSpawns\0updates\0"
    "updateSpawnInfo\0spawnupdate\0renameSpawn\0"
    "renameupdate\0illusionSpawn\0illusionupdate\0"
    "updateSpawnAppearance\0appearanceupdate\0"
    "shroudSpawn\0updateNpcHP\0hpupdate\0"
    "spawnWearingUpdate\0wearing\0consMessage\0"
    "con\0removeSpawn\0rmSpawn\0dir\0deleteSpawn\0"
    "delSpawn\0deadspawn\0respawnFromHover\0"
    "respawn\0corpseLoc\0playerChangedID\0"
    "oldPlayerID\0newPlayerID\0refilterSpawns\0"
    "refilterSpawnsRuntime\0saveSpawns\0"
    "restoreSpawns\0updateGuildTag\0guildId"
};
#undef QT_MOC_LITERAL

static const uint qt_meta_data_SpawnShell[] = {

 // content:
       8,       // revision
       0,       // classname
       0,    0, // classinfo
      41,   14, // methods
       0,    0, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
       8,       // signalCount

 // signals: name, argc, parameters, tag, flags
       1,    1,  219,    2, 0x06 /* Public */,
       5,    1,  222,    2, 0x06 /* Public */,
       6,    2,  225,    2, 0x06 /* Public */,
       9,    3,  230,    2, 0x06 /* Public */,
      14,    1,  237,    2, 0x06 /* Public */,
      15,    1,  240,    2, 0x06 /* Public */,
      16,    0,  243,    2, 0x06 /* Public */,
      17,    1,  244,    2, 0x06 /* Public */,

 // slots: name, argc, parameters, tag, flags
      18,    0,  247,    2, 0x0a /* Public */,
      19,    3,  248,    2, 0x0a /* Public */,
      23,    3,  255,    2, 0x0a /* Public */,
      24,    3,  262,    2, 0x0a /* Public */,
      25,    3,  269,    2, 0x0a /* Public */,
      27,    2,  276,    2, 0x0a /* Public */,
      30,    2,  281,    2, 0x0a /* Public */,
      32,    1,  286,    2, 0x0a /* Public */,
      32,    1,  289,    2, 0x0a /* Public */,
      35,    3,  292,    2, 0x0a /* Public */,
      37,    3,  299,    2, 0x0a /* Public */,
      38,    3,  306,    2, 0x0a /* Public */,
      40,   10,  313,    2, 0x0a /* Public */,
      53,    1,  334,    2, 0x0a /* Public */,
      55,    1,  337,    2, 0x0a /* Public */,
      57,    1,  340,    2, 0x0a /* Public */,
      59,    1,  343,    2, 0x0a /* Public */,
      61,    1,  346,    2, 0x0a /* Public */,
      63,    3,  349,    2, 0x0a /* Public */,
      64,    1,  356,    2, 0x0a /* Public */,
      66,    1,  359,    2, 0x0a /* Public */,
      68,    3,  362,    2, 0x0a /* Public */,
      70,    3,  369,    2, 0x0a /* Public */,
      73,    1,  376,    2, 0x0a /* Public */,
       9,    1,  379,    2, 0x0a /* Public */,
      76,    3,  382,    2, 0x0a /* Public */,
      78,    1,  389,    2, 0x0a /* Public */,
      79,    2,  392,    2, 0x0a /* Public */,
      82,    0,  397,    2, 0x0a /* Public */,
      83,    0,  398,    2, 0x0a /* Public */,
      84,    0,  399,    2, 0x0a /* Public */,
      85,    0,  400,    2, 0x0a /* Public */,
      86,    1,  401,    2, 0x0a /* Public */,

 // signals: parameters
    QMetaType::Void, 0x80000000 | 3,    4,
    QMetaType::Void, 0x80000000 | 3,    4,
    QMetaType::Void, 0x80000000 | 3, 0x80000000 | 7,    4,    8,
    QMetaType::Void, 0x80000000 | 3, 0x80000000 | 3, 0x80000000 | 12,   10,   11,   13,
    QMetaType::Void, 0x80000000 | 3,    4,
    QMetaType::Void, 0x80000000 | 3,    4,
    QMetaType::Void,
    QMetaType::Void, QMetaType::Int,    2,

 // slots: parameters
    QMetaType::Void,
    QMetaType::Void, 0x80000000 | 20, 0x80000000 | 21, 0x80000000 | 22,    2,    2,    2,
    QMetaType::Void, 0x80000000 | 20, 0x80000000 | 21, 0x80000000 | 22,    2,    2,    2,
    QMetaType::Void, 0x80000000 | 20, 0x80000000 | 21, 0x80000000 | 22,    2,    2,    2,
    QMetaType::Void, 0x80000000 | 26, 0x80000000 | 21, 0x80000000 | 22,    2,    2,    2,
    QMetaType::Void, 0x80000000 | 20, 0x80000000 | 21,   28,   29,
    QMetaType::Void, 0x80000000 | 20, 0x80000000 | 21,   31,   29,
    QMetaType::Void, 0x80000000 | 20,   31,
    QMetaType::Void, 0x80000000 | 33,   34,
    QMetaType::Void, 0x80000000 | 20, 0x80000000 | 21, 0x80000000 | 22,   36,    2,    2,
    QMetaType::Void, 0x80000000 | 20, 0x80000000 | 21, 0x80000000 | 22,   36,    2,    2,
    QMetaType::Void, 0x80000000 | 20, 0x80000000 | 21, 0x80000000 | 22,   39,    2,    2,
    QMetaType::Void, 0x80000000 | 12, 0x80000000 | 42, 0x80000000 | 42, 0x80000000 | 42, 0x80000000 | 42, 0x80000000 | 42, 0x80000000 | 42, 0x80000000 | 49, 0x80000000 | 49, 0x80000000 | 22,   41,   43,   44,   45,   46,   47,   48,   50,   51,   52,
    QMetaType::Void, 0x80000000 | 20,   54,
    QMetaType::Void, 0x80000000 | 20,   56,
    QMetaType::Void, 0x80000000 | 20,   58,
    QMetaType::Void, 0x80000000 | 20,   60,
    QMetaType::Void, 0x80000000 | 20,   62,
    QMetaType::Void, 0x80000000 | 20, 0x80000000 | 21, 0x80000000 | 22,   56,    2,    2,
    QMetaType::Void, 0x80000000 | 20,   65,
    QMetaType::Void, 0x80000000 | 20,   67,
    QMetaType::Void, 0x80000000 | 20, 0x80000000 | 21, 0x80000000 | 22,   69,    2,    2,
    QMetaType::Void, 0x80000000 | 20, 0x80000000 | 21, 0x80000000 | 22,   71,   29,   72,
    QMetaType::Void, 0x80000000 | 20,   74,
    QMetaType::Void, 0x80000000 | 20,   75,
    QMetaType::Void, 0x80000000 | 20, 0x80000000 | 21, 0x80000000 | 22,   77,   29,   72,
    QMetaType::Void, 0x80000000 | 20,   78,
    QMetaType::Void, 0x80000000 | 12, 0x80000000 | 12,   80,   81,
    QMetaType::Void,
    QMetaType::Void,
    QMetaType::Void,
    QMetaType::Void,
    QMetaType::Void, 0x80000000 | 7,   87,

       0        // eod
};

void SpawnShell::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        auto *_t = static_cast<SpawnShell *>(_o);
        (void)_t;
        switch (_id) {
        case 0: _t->addItem((*reinterpret_cast< const Item*(*)>(_a[1]))); break;
        case 1: _t->delItem((*reinterpret_cast< const Item*(*)>(_a[1]))); break;
        case 2: _t->changeItem((*reinterpret_cast< const Item*(*)>(_a[1])),(*reinterpret_cast< uint32_t(*)>(_a[2]))); break;
        case 3: _t->killSpawn((*reinterpret_cast< const Item*(*)>(_a[1])),(*reinterpret_cast< const Item*(*)>(_a[2])),(*reinterpret_cast< uint16_t(*)>(_a[3]))); break;
        case 4: _t->selectSpawn((*reinterpret_cast< const Item*(*)>(_a[1]))); break;
        case 5: _t->spawnConsidered((*reinterpret_cast< const Item*(*)>(_a[1]))); break;
        case 6: _t->clearItems(); break;
        case 7: _t->numSpawns((*reinterpret_cast< int(*)>(_a[1]))); break;
        case 8: _t->clear(); break;
        case 9: _t->newGroundItem((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3]))); break;
        case 10: _t->removeGroundItem((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3]))); break;
        case 11: _t->newDoorSpawns((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3]))); break;
        case 12: _t->newDoorSpawn((*reinterpret_cast< const doorStruct(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3]))); break;
        case 13: _t->zoneSpawns((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2]))); break;
        case 14: _t->zoneEntry((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2]))); break;
        case 15: _t->newSpawn((*reinterpret_cast< const uint8_t*(*)>(_a[1]))); break;
        case 16: _t->newSpawn((*reinterpret_cast< const spawnStruct(*)>(_a[1]))); break;
        case 17: _t->playerUpdate2((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3]))); break;
        case 18: _t->playerUpdate((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3]))); break;
        case 19: _t->npcMoveUpdate((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3]))); break;
        case 20: _t->updateSpawn((*reinterpret_cast< uint16_t(*)>(_a[1])),(*reinterpret_cast< int16_t(*)>(_a[2])),(*reinterpret_cast< int16_t(*)>(_a[3])),(*reinterpret_cast< int16_t(*)>(_a[4])),(*reinterpret_cast< int16_t(*)>(_a[5])),(*reinterpret_cast< int16_t(*)>(_a[6])),(*reinterpret_cast< int16_t(*)>(_a[7])),(*reinterpret_cast< int8_t(*)>(_a[8])),(*reinterpret_cast< int8_t(*)>(_a[9])),(*reinterpret_cast< uint8_t(*)>(_a[10]))); break;
        case 21: _t->updateSpawns((*reinterpret_cast< const uint8_t*(*)>(_a[1]))); break;
        case 22: _t->updateSpawnInfo((*reinterpret_cast< const uint8_t*(*)>(_a[1]))); break;
        case 23: _t->renameSpawn((*reinterpret_cast< const uint8_t*(*)>(_a[1]))); break;
        case 24: _t->illusionSpawn((*reinterpret_cast< const uint8_t*(*)>(_a[1]))); break;
        case 25: _t->updateSpawnAppearance((*reinterpret_cast< const uint8_t*(*)>(_a[1]))); break;
        case 26: _t->shroudSpawn((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3]))); break;
        case 27: _t->updateNpcHP((*reinterpret_cast< const uint8_t*(*)>(_a[1]))); break;
        case 28: _t->spawnWearingUpdate((*reinterpret_cast< const uint8_t*(*)>(_a[1]))); break;
        case 29: _t->consMessage((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3]))); break;
        case 30: _t->removeSpawn((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3]))); break;
        case 31: _t->deleteSpawn((*reinterpret_cast< const uint8_t*(*)>(_a[1]))); break;
        case 32: _t->killSpawn((*reinterpret_cast< const uint8_t*(*)>(_a[1]))); break;
        case 33: _t->respawnFromHover((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3]))); break;
        case 34: _t->corpseLoc((*reinterpret_cast< const uint8_t*(*)>(_a[1]))); break;
        case 35: _t->playerChangedID((*reinterpret_cast< uint16_t(*)>(_a[1])),(*reinterpret_cast< uint16_t(*)>(_a[2]))); break;
        case 36: _t->refilterSpawns(); break;
        case 37: _t->refilterSpawnsRuntime(); break;
        case 38: _t->saveSpawns(); break;
        case 39: _t->restoreSpawns(); break;
        case 40: _t->updateGuildTag((*reinterpret_cast< uint32_t(*)>(_a[1]))); break;
        default: ;
        }
    } else if (_c == QMetaObject::IndexOfMethod) {
        int *result = reinterpret_cast<int *>(_a[0]);
        {
            using _t = void (SpawnShell::*)(const Item * );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&SpawnShell::addItem)) {
                *result = 0;
                return;
            }
        }
        {
            using _t = void (SpawnShell::*)(const Item * );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&SpawnShell::delItem)) {
                *result = 1;
                return;
            }
        }
        {
            using _t = void (SpawnShell::*)(const Item * , uint32_t );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&SpawnShell::changeItem)) {
                *result = 2;
                return;
            }
        }
        {
            using _t = void (SpawnShell::*)(const Item * , const Item * , uint16_t );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&SpawnShell::killSpawn)) {
                *result = 3;
                return;
            }
        }
        {
            using _t = void (SpawnShell::*)(const Item * );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&SpawnShell::selectSpawn)) {
                *result = 4;
                return;
            }
        }
        {
            using _t = void (SpawnShell::*)(const Item * );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&SpawnShell::spawnConsidered)) {
                *result = 5;
                return;
            }
        }
        {
            using _t = void (SpawnShell::*)();
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&SpawnShell::clearItems)) {
                *result = 6;
                return;
            }
        }
        {
            using _t = void (SpawnShell::*)(int );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&SpawnShell::numSpawns)) {
                *result = 7;
                return;
            }
        }
    }
}

QT_INIT_METAOBJECT const QMetaObject SpawnShell::staticMetaObject = { {
    QMetaObject::SuperData::link<QObject::staticMetaObject>(),
    qt_meta_stringdata_SpawnShell.data,
    qt_meta_data_SpawnShell,
    qt_static_metacall,
    nullptr,
    nullptr
} };


const QMetaObject *SpawnShell::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->dynamicMetaObject() : &staticMetaObject;
}

void *SpawnShell::qt_metacast(const char *_clname)
{
    if (!_clname) return nullptr;
    if (!strcmp(_clname, qt_meta_stringdata_SpawnShell.stringdata0))
        return static_cast<void*>(this);
    return QObject::qt_metacast(_clname);
}

int SpawnShell::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = QObject::qt_metacall(_c, _id, _a);
    if (_id < 0)
        return _id;
    if (_c == QMetaObject::InvokeMetaMethod) {
        if (_id < 41)
            qt_static_metacall(this, _c, _id, _a);
        _id -= 41;
    } else if (_c == QMetaObject::RegisterMethodArgumentMetaType) {
        if (_id < 41)
            *reinterpret_cast<int*>(_a[0]) = -1;
        _id -= 41;
    }
    return _id;
}

// SIGNAL 0
void SpawnShell::addItem(const Item * _t1)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))) };
    QMetaObject::activate(this, &staticMetaObject, 0, _a);
}

// SIGNAL 1
void SpawnShell::delItem(const Item * _t1)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))) };
    QMetaObject::activate(this, &staticMetaObject, 1, _a);
}

// SIGNAL 2
void SpawnShell::changeItem(const Item * _t1, uint32_t _t2)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))) };
    QMetaObject::activate(this, &staticMetaObject, 2, _a);
}

// SIGNAL 3
void SpawnShell::killSpawn(const Item * _t1, const Item * _t2, uint16_t _t3)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t3))) };
    QMetaObject::activate(this, &staticMetaObject, 3, _a);
}

// SIGNAL 4
void SpawnShell::selectSpawn(const Item * _t1)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))) };
    QMetaObject::activate(this, &staticMetaObject, 4, _a);
}

// SIGNAL 5
void SpawnShell::spawnConsidered(const Item * _t1)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))) };
    QMetaObject::activate(this, &staticMetaObject, 5, _a);
}

// SIGNAL 6
void SpawnShell::clearItems()
{
    QMetaObject::activate(this, &staticMetaObject, 6, nullptr);
}

// SIGNAL 7
void SpawnShell::numSpawns(int _t1)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))) };
    QMetaObject::activate(this, &staticMetaObject, 7, _a);
}
QT_WARNING_POP
QT_END_MOC_NAMESPACE
